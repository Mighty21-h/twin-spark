const pool = require('../db');
const { OpenAI } = require('openai');
require('dotenv').config();

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "sk-dummy-key-for-development",
});

const getRecommendations = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Fetch user profile (Robust)
        let user = { department: 'Computer Science', interests: 'Web Development, Artificial Intelligence' };
        try {
            const [userRows] = await pool.query('SELECT department, interests FROM users WHERE id = ?', [userId]);
            if (userRows.length > 0) user = userRows[0];
        } catch (e) { console.warn("DB Error fetching user profile:", e.message); }

        // 2. Fetch completed skills (Robust)
        let completedSkills = [];
        try {
            const [skillsRows] = await pool.query('SELECT skill_name FROM user_skills WHERE user_id = ? AND status = "completed"', [userId]);
            completedSkills = skillsRows.map(row => row.skill_name);
        } catch (e) { console.warn("DB Error fetching skills:", e.message); }

        // 3. Fetch past projects (Robust)
        let completedProjects = [];
        try {
            const [activityRows] = await pool.query('SELECT activity_name, type FROM user_activity WHERE user_id = ? AND type = "project"', [userId]);
            completedProjects = activityRows.map(row => row.activity_name);
        } catch (e) { console.warn("DB Error fetching projects:", e.message); }

        // 4. Fetch incoming events (Robust)
        let availableEvents = [];
        try {
            const [eventsRows] = await pool.query('SELECT event_name, description FROM events WHERE date >= CURDATE() LIMIT 5');
            availableEvents = eventsRows.map(row => `${row.event_name}: ${row.description}`);
        } catch (e) { console.warn("DB Error fetching events:", e.message); }

        // 5. Build AI Prompt Context
        const prompt = `
        You are an intelligent academic and career advisor for an Ethiopian university student using the "Bilih Smart Link" platform.
        Your goal is to recommend the logical next steps for the student based ONLY on their current campus profile.
        Keep the scope strictly to practical tech skills, software projects, and campus events.

        Student Profile:
        - Department: ${user.department}
        - Interests: ${user.interests}
        - Completed Skills: ${completedSkills.length > 0 ? completedSkills.join(', ') : 'None yet (Beginner level)'}
        - Completed Projects: ${completedProjects.length > 0 ? completedProjects.join(', ') : 'None yet'}
        - Upcoming Campus Events: ${availableEvents.length > 0 ? availableEvents.join(' | ') : 'No upcoming events'}

        Return a raw JSON object:
        {
            "nextSkill": "short actionable skill",
            "nextProject": "practical project",
            "nextEvent": "recommended event"
        }
        `;

        let recommendations;
        try {
            // 6. Call OpenAI API
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are a localized recommendation engine that STRICTLY outputs valid JSON." },
                    { role: "user", content: prompt }
                ],
                response_format: { type: "json_object" }
            });
            recommendations = JSON.parse(response.choices[0].message.content);
        } catch (error) {
            console.error("OpenAI Recommendation Error:", error.message);
            
            let warning = "Using Simulated Recommendations.";
            if (error.message.includes("429") || error.message.includes("quota")) warning = "Quota Exceeded. " + warning;
            
            // Simulation Fallback
            recommendations = {
                "nextSkill": `Introduction to JavaScript (Simulated due to: ${warning})`,
                "nextProject": "Personal Portfolio Website",
                "nextEvent": "Local Tech Meetup nearby"
            };
        }

        return res.status(200).json({
            success: true,
            data: recommendations
        });

    } catch (error) {
        console.error("AI Recommendation Critical Error:", error);
        return res.status(500).json({ success: false, message: "Failed to generate recommendations.", error: error.message });
    }
};

module.exports = { getRecommendations };
