const pool = require('../db');
const axios = require('axios');
require('dotenv').config();

// Mock AI query function
const queryMock = async (promptText) => {
    return "This is a simulated AI response.";
};

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

        // --- STEP 1: DB INITIALIZATION (Robust) ---
        try {
            await pool.query(`CREATE TABLE IF NOT EXISTS vocabulary (id INT AUTO_INCREMENT PRIMARY KEY, word VARCHAR(255) NOT NULL, meaning TEXT NOT NULL, language VARCHAR(100) NOT NULL, context VARCHAR(255) DEFAULT 'general', UNIQUE KEY unique_word_lang (word, language))`);
            await pool.query(`CREATE TABLE IF NOT EXISTS language_activity (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, input_text TEXT NOT NULL, ai_response TEXT NOT NULL, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
            try { await pool.query(`ALTER TABLE language_activity ADD COLUMN from_lang VARCHAR(100) AFTER user_id`); } catch (e) {}
            try { await pool.query(`ALTER TABLE language_activity ADD COLUMN to_lang VARCHAR(100) AFTER from_lang`); } catch (e) {}
        } catch (dbError) {
            console.error("Database initialization failed (continuing in mock-log mode):", dbError.message);
        }

        // --- STEP 2: HYBRID CHECK (DB LOOKUP) ---
        let finalResponse = "";
        let isSimulated = false;
        let warningMessage = "";

        try {
            const [vocabRows] = await pool.query(
                'SELECT meaning FROM vocabulary WHERE word = ? AND language = ?',
                [inputText.trim(), targetLanguage]
            );
            if (vocabRows.length > 0) {
                finalResponse = `Local Match: "${inputText}" means "${vocabRows[0].meaning}" in ${targetLanguage}.`;
            }
        } catch (e) {
            console.warn("Local DB lookup failed:", e.message);
        }

        if (!finalResponse) {
            // STEP 3: MOCK TUTOR RESPONSE (Since Gemini is removed)
            const mockResponses = {
                "Amharic": `Simulated Tutor: I would translate "${inputText}" to Amharic by explaining its grammatical role. Try: "Endet neh?" (How are you?)`,
                "Afaan Oromo": `Simulated Tutor: In Afaan Oromoo, "${inputText}" would be translated based on the Ethiopian context. For example: "Akkam jirtu?"`,
                "English": `Simulated Tutor: To say "${inputText}" in English, we use clear university-level vocabulary. Try: "Please assist me with my studies."`
            };
            const simText = mockResponses[targetLanguage] || `Simulated Tutor: Learning ${targetLanguage} is exciting! Try practicing simple phrases first.`;
            finalResponse = simText;
            isSimulated = true;
        }

        // --- STEP 4: LOG ACTIVITY (Robust) ---
        try {
            await pool.query(
                'INSERT INTO language_activity (user_id, from_lang, to_lang, input_text, ai_response) VALUES (?, ?, ?, ?, ?)',
                [userId, sourceLanguage, targetLanguage, inputText, finalResponse]
            );
        } catch (logError) {
            console.error("Failed to log activity to DB:", logError.message);
        }

        return res.status(200).json({ success: true, reply: finalResponse, simulated: isSimulated });
    } catch (error) {
        console.error("Language Tutor critical error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "AI Tutor is having trouble connecting.", 
            error: error.message 
        });
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

/**
 * STRICT TRANSLATION ONLY ENDPOINT
 * Languages supported: Amharic, Afaan Oromo, English
 */
const dictionary = {
  "hello": {
    amharic: "ሰላም",
    oromo: "Akkam"
  },
  "selam": {
    english: "Hello",
    oromo: "Akkam"
  },
  "ሰላም": {
    english: "Hello",
    oromo: "Akkam"
  },
  "akkam": {
    english: "Hello",
    amharic: "ሰላም"
  }
};

const translateLanguage = async (req, res) => {
    try {
        const { sourceLanguage, targetLanguage, inputText } = req.body;

        if (!sourceLanguage || !targetLanguage || !inputText) {
            return res.json({ translation: "Translation not available right now" });
        }

        const validLangs = ["amharic", "afaan oromo", "oromo", "english"];
        let sLang = sourceLanguage.toLowerCase();
        let tLang = targetLanguage.toLowerCase();

        if (sLang === "afaan oromo") sLang = "oromo";
        if (tLang === "afaan oromo") tLang = "oromo";

        if (!validLangs.includes(sLang) || !validLangs.includes(tLang)) {
            return res.json({ translation: "Translation not available right now" });
        }

        // Fallback dictionary check
        const normalizedInput = inputText.trim().toLowerCase();
        if (dictionary[normalizedInput] && dictionary[normalizedInput][tLang]) {
            return res.json({ translation: dictionary[normalizedInput][tLang] });
        }

        // MOCK Translation logic (Since Gemini is removed)
        const finalTranslation = `[Simulated] Translated "${inputText}" to ${tLang}`;

        return res.json({ translation: finalTranslation });

    } catch (error) {
        console.error("Translate error:", error);
        return res.json({ translation: "Translation not available right now" });
    }
};

module.exports = { practiceLanguage, getPracticeHistory, translateLanguage };
