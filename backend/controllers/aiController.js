const pool = require('../db');
const axios = require('axios');
require('dotenv').config();

// Mock AI query function
const queryMock = async (promptText) => {
    return "This is a simulated AI response.";
};

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

        // Use Simulation Fallback
        const recommendations = {
            "nextSkill": `Introduction to JavaScript (Simulated AI)`,
            "nextProject": "Personal Portfolio Website",
            "nextEvent": "Local Tech Meetup nearby"
        };

        return res.status(200).json({
            success: true,
            data: recommendations
        });

    } catch (error) {
        console.error("AI Recommendation Critical Error:", error);
        return res.status(500).json({ success: false, message: "Failed to generate recommendations.", error: error.message });
    }
};

const getGPASuggestions = async (req, res) => {
    try {
        const { department, semester, currentGPA, courses } = req.body;
        const prompt = `
        As an academic advisor for a ${department} student in Ethiopia (Semester ${semester}, Current GPA: ${currentGPA}), 
        suggest a roadmap based on these enrolled courses: ${courses.map(c => c.name).join(', ')}.
        
        Return a raw JSON object:
        {
            "skills": ["skill 1", "skill 2"],
            "courses": ["elective 1", "elective 2"],
            "languages": ["language 1", "language 2"]
        }
        `;

        // Mock Fallback for GPA suggestions
        const suggestions = {
            "skills": ["Cloud Infrastructure", "System Design"],
            "courses": ["Ethics in AI", "Entrepreneurship for Engineers"],
            "languages": ["Amharic (Technical Focus)", "English (Professional)"]
        };

        return res.status(200).json({ success: true, data: suggestions });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const generateStudySchedule = async (req, res) => {
    try {
        const { selectedCourses = [], freeTime = {}, deadlines = [], week = "" } = req.body;
        console.log(`[AI] Generating schedule for week: ${week}, courses: ${selectedCourses.length}`);
        
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        const timeSlots = [
            "12:00 Morning", "1:00 LT", "2:00 LT", "3:00 LT", "4:00 LT", "5:00 LT", "6:00 Midday",
            "7:00 LT", "8:00 LT", "9:00 LT", "10:00 LT", "11:00 LT", "12:00 Night",
            "1:00 Night", "2:00 Night", "3:00 Night", "4:00 Night"
        ];

        const mock = {};
        
        days.forEach(day => {
            const userSlots = freeTime[day] || [];
            
            // Map the daily schedule
            mock[day] = timeSlots.map((time, idx) => {
                // If user selected this slot, fill it with a course or 'Study'
                if (userSlots.includes(time)) {
                    const course = selectedCourses[idx % selectedCourses.length] || { name: "Self Study", color: "bg-blue-500" };
                    return {
                        time,
                        name: course.name,
                        type: 'study',
                        color: course.color || "bg-blue-500"
                    };
                }
                
                // If not selected, mark as 'unavailable' or 'free'
                return {
                    time,
                    name: "Free",
                    type: 'free',
                    color: "transparent"
                };
            });
        });

        return res.status(200).json({ 
            success: true, 
            schedule: mock,
            message: "Schedule generated based on your availability! 🧠" 
        });
    } catch (error) {
        console.error("[AI ERROR] Generation failed:", error);
        return res.status(500).json({ success: false, message: "AI Engine error: " + error.message });
    }
};

module.exports = { getRecommendations, getGPASuggestions, generateStudySchedule };
