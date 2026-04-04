const pool = require('../db');
const { OpenAI } = require('openai');
const axios = require('axios');
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
            const isApiKeyDummy = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes("placeholder") || process.env.OPENAI_API_KEY.includes("dummy");
            
            if (isApiKeyDummy) {
                isSimulated = true;
                warningMessage = "Running in Simulated Mode (Dummy API Key).";
            } else {
                try {
                    // --- STEP 3: REAL OPENAI CALL ---
                    const prompt = `
                    You are a translation and language tutor for Ethiopian students.
                    Task: Translate from ${sourceLanguage} TO ${targetLanguage}.
                    
                    Instruction:
                    1. Provide a direct translation of "${inputText}".
                    2. If it's a phrase, explain the usage and grammar in ${targetLanguage}.
                    3. Include phonetics or the Amharic/Oromo script if applicable.
                    4. If the student makes a mistake, gently correct them.
                    5. Keep the response BRIEF and beginner-friendly (max 3 lines).
                    `;

                    const completion = await openai.chat.completions.create({
                        model: "gpt-4o-mini",
                        messages: [
                            { role: "system", content: "You are a concise translation assistant and tutor." },
                            { role: "user", content: prompt }
                        ]
                    });
                    finalResponse = completion.choices[0].message.content;
                } catch (error) {
                    console.error("OpenAI API Error:", error.message);
                    isSimulated = true;
                    
                    if (error.message.includes("429") || error.message.includes("quota")) {
                        warningMessage = "OpenAI Quota Exceeded. Using Simulated Tutor.";
                    } else if (error.message.includes("401")) {
                        warningMessage = "Invalid OpenAI API Key. Using Simulated Tutor.";
                    } else {
                        warningMessage = "AI Connection issue. Using Simulated Tutor.";
                    }
                }
            }

            if (isSimulated) {
                const mockResponses = {
                    "Amharic": `Simulated Tutor: I would translate "${inputText}" to Amharic by explaining its grammatical role. Try: "Endet neh?" (How are you?)`,
                    "Afaan Oromo": `Simulated Tutor: In Afaan Oromoo, "${inputText}" would be translated based on the Ethiopian context. For example: "Akkam jirtu?"`,
                    "English": `Simulated Tutor: To say "${inputText}" in English, we use clear university-level vocabulary. Try: "Please assist me with my studies."`
                };
                const simText = mockResponses[targetLanguage] || `Simulated Tutor: Learning ${targetLanguage} is exciting! Try practicing simple phrases first.`;
                finalResponse = warningMessage ? `[NOTICE: ${warningMessage}]\n\n${simText}` : simText;
            }
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

        // Helper for HuggingFace direct translation
        const hfTranslate = async (text, s, t) => {
            const apiKey = process.env.HUGGINGFACE_API_KEY;
            if (!apiKey) throw new Error("Missing HR API Key");

            let model = null;
            if (s === 'english' && t === 'amharic') model = 'Helsinki-NLP/opus-mt-en-am';
            else if (s === 'amharic' && t === 'english') model = 'Helsinki-NLP/opus-mt-am-en';
            else if (s === 'english' && t === 'oromo') model = 'Helsinki-NLP/opus-mt-en-mul';
            else if (s === 'oromo' && t === 'english') model = 'Helsinki-NLP/opus-mt-mul-en';

            if (!model) {
                // If direct model not matched and neither is English, we'll return null to pivot
                return null;
            }

            const response = await axios.post(
                `https://router.huggingface.co/hf-inference/models/${model}`,
                { inputs: text },
                {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response.data && response.data[0] && response.data[0].translation_text) {
                return response.data[0].translation_text;
            }
            throw new Error("HF structure missing translation_text");
        };

        // Pivot translation logic
        let finalTranslation = "";
        try {
            const directTranslate = await hfTranslate(inputText, sLang, tLang);
            if (directTranslate) {
                finalTranslation = directTranslate;
            } else {
                // Pivot through English
                const toEnglishText = await hfTranslate(inputText, sLang, 'english');
                if (!toEnglishText) throw new Error("Pivot to English failed");
                
                const toTargetText = await hfTranslate(toEnglishText, 'english', tLang);
                if (!toTargetText) throw new Error("Pivot to Target failed");
                finalTranslation = toTargetText;
            }
        } catch (apiErr) {
            console.error("HuggingFace API translation error:", apiErr.message);
            return res.json({ translation: "Translation not available right now" });
        }

        return res.json({ translation: finalTranslation });

    } catch (error) {
        console.error("Translate error:", error);
        return res.json({ translation: "Translation not available right now" });
    }
};

module.exports = { practiceLanguage, getPracticeHistory, translateLanguage };
