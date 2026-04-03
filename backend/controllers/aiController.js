const pool = require('../db');
const { OpenAI } = require('openai');
require('dotenv').config();

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "sk-dummy-key-for-development",
});

const getRecommendations = async (req, res) => {
    try {
        // User ID is extracted from the JWT token via authenticateJWT middleware
        const userId = req.user.id;

        // 1. Fetch user profile
        const [userRows] = await pool.query('SELECT department, interests FROM users WHERE id = ?', [userId]);
        const user = userRows[0];

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // 2. Fetch completed skills for the user
        const [skillsRows] = await pool.query('SELECT skill_name FROM user_skills WHERE user_id = ? AND status = "completed"', [userId]);
        const completedSkills = skillsRows.map(row => row.skill_name);

        // 3. Fetch past projects/activities
        const [activityRows] = await pool.query('SELECT activity_name, type FROM user_activity WHERE user_id = ? AND type = "project"', [userId]);
        const completedProjects = activityRows.map(row => row.activity_name);

        // 4. Fetch incoming events/hackathons to potentially recommend
        // We limit to 5 active events
        const [eventsRows] = await pool.query('SELECT event_name, description FROM events WHERE date >= CURDATE() LIMIT 5');
        const availableEvents = eventsRows.map(row => `${row.event_name}: ${row.description}`);

        // 5. Build AI Prompt Context
        const prompt = `
        You are an intelligent academic and career advisor for an Ethiopian university student using the "Bilih Smart Link" platform.
        Your goal is to recommend the logical next steps for the student based ONLY on their current campus profile.
        Keep the scope strictly to practical tech skills, software projects, and campus events. Do not give general life advice.

        Student Profile:
        - Department: ${user.department || 'Computer Science'}
        - Interests: ${user.interests || 'Web Development, Artificial Intelligence'}
        - Completed Skills: ${completedSkills.length > 0 ? completedSkills.join(', ') : 'None yet (Beginner level)'}
        - Completed Projects: ${completedProjects.length > 0 ? completedProjects.join(', ') : 'None yet'}
        - Upcoming Campus Events: ${availableEvents.length > 0 ? availableEvents.join(' | ') : 'No upcoming events'}

        Follow simple progression rules. For example, if they know HTML/CSS, recommend JavaScript. If they know Web Dev basics, recommend an entry-level Portfolio Project. If they have none, recommend Python or HTML.
        
        You must return a raw JSON object with exactly the following keys:
        {
            "nextSkill": "A short, actionable tech skill to learn next",
            "nextProject": "A practical project to build applying the skill",
            "nextEvent": "A recommended event or hackathon from the list, or a generic relevant tech meetup"
        }
        `;

        // 6. Call OpenAI API for the structured recommendation
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Cost-effective model perfect for hackathons
            messages: [
                { role: "system", content: "You are a localized recommendation engine that STRICTLY outputs valid JSON." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        });

        // 7. Parse output and return response
        const recommendations = JSON.parse(response.choices[0].message.content);

        return res.status(200).json({
            success: true,
            data: recommendations
        });

    } catch (error) {
        console.error("AI Recommendation Error:", error);
        return res.status(500).json({ success: false, message: "Failed to generate recommendations.", error: error.message });
    }
};

module.exports = { getRecommendations };
