const pool = require('../db');
const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "sk-dummy-key-for-development",
});

/**
 * Hybrid Practice Language Logic:
 * 1. Initialize Tables (for hackathon persistence)
 * 2. Search local DB for exact word match
 * 3. Fallback to OpenAI if no local match
 */
const practiceLanguage = async (req, res) => {
    try {
        const userId = req.user.id;
        const { sourceLanguage, targetLanguage, inputText } = req.body;

        if (!sourceLanguage || !targetLanguage || !inputText) {
            return res.status(400).json({ success: false, message: "Missing language details or input text." });
        }

        // Initialize Tables (standard practice)
        await pool.query(`CREATE TABLE IF NOT EXISTS vocabulary (id INT AUTO_INCREMENT PRIMARY KEY, word VARCHAR(255) NOT NULL, meaning TEXT NOT NULL, language VARCHAR(100) NOT NULL, context VARCHAR(255) DEFAULT 'general', UNIQUE KEY unique_word_lang (word, language))`);
        await pool.query(`CREATE TABLE IF NOT EXISTS language_activity (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, input_text TEXT NOT NULL, ai_response TEXT NOT NULL, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
        
        // Migration: Ensure from_lang and to_lang exist
        try { await pool.query(`ALTER TABLE language_activity ADD COLUMN from_lang VARCHAR(100) AFTER user_id`); } catch (e) {}
        try { await pool.query(`ALTER TABLE language_activity ADD COLUMN to_lang VARCHAR(100) AFTER from_lang`); } catch (e) {}

        // --- STEP 1: HYBRID CHECK (DB LOOKUP) ---
        // Look for exact word match in the TARGET language
        const [vocabRows] = await pool.query(
            'SELECT meaning FROM vocabulary WHERE word = ? AND language = ?',
            [inputText.trim(), targetLanguage]
        );

        let finalResponse = "";
        if (vocabRows.length > 0) {
            finalResponse = `Local Match: "${inputText}" means "${vocabRows[0].meaning}" in ${targetLanguage}.`;
        } else {
            // Check for Placeholder or Invalid API Key to provide a Simulated Experience
            const isPlaceholder = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes("placeholder") || process.env.OPENAI_API_KEY.includes("dummy");
            
            if (isPlaceholder) {
                // --- STEP 2.A: SIMULATION MODE (Mock AI) ---
                const mockResponses = {
                    "Amharic": `Simulated Tutor: I would translate "${inputText}" to Amharic by explaining its grammatical role. Try: "Endet neh?" (How are you?)`,
                    "Afaan Oromo": `Simulated Tutor: In Afaan Oromoo, "${inputText}" would be translated based on the Ethiopian context. For example: "Akkam jirtu?"`,
                    "English": `Simulated Tutor: To say "${inputText}" in English, we use clear university-level vocabulary. Try: "Please assist me with my studies."`
                };
                finalResponse = mockResponses[targetLanguage] || `Simulated Tutor: Learning ${targetLanguage} is exciting! Try practicing simple phrases first.`;
            } else {
                // --- STEP 2.B: REAL OPENAI CALL ---
                const prompt = `
                You are a translation and language tutor for Ethiopian students.
                Task: Translate from ${sourceLanguage} TO ${targetLanguage}.
                
                Instruction:
                1. Provide a direct translation of "${inputText}".
                2. If it's a phrase, explain the usage and grammar in ${targetLanguage}.
                3. Include phonetics or the Amharic/Oromo script if applicable.
                4. If the student makes a mistake, gently correct them.
                5. Keep the response BRIEF and beginner-friendly (max 3 lines).
                6. Only discuss language and student support.
                `;

                const completion = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: "You are a concise translation assistant and tutor." },
                        { role: "user", content: prompt }
                    ]
                });

                finalResponse = completion.choices[0].message.content;
            }
        }

        // --- STEP 3: LOG ACTIVITY ---
        await pool.query(
            'INSERT INTO language_activity (user_id, from_lang, to_lang, input_text, ai_response) VALUES (?, ?, ?, ?, ?)',
            [userId, sourceLanguage, targetLanguage, inputText, finalResponse]
        );

        return res.status(200).json({ success: true, reply: finalResponse });
    } catch (error) {
        console.error("Language Tutor error:", error);
        
        let errorMsg = "AI Tutor is having trouble connecting.";
        if (error.message && error.message.includes("401")) {
            errorMsg = "AI Assistant error: Invalid OpenAI API Key. Please update your .env file.";
        }
        
        return res.status(500).json({ success: false, message: errorMsg, error: error.message });
    }
};

const getPracticeHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const [rows] = await pool.query(
            'SELECT * FROM language_activity WHERE user_id = ? ORDER BY timestamp DESC LIMIT 20',
            [userId]
        );
        return res.status(200).json({ success: true, history: rows });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to load history." });
    }
};

module.exports = { practiceLanguage, getPracticeHistory };
