const pool = require('../db');

const submitFeedback = async (req, res) => {
    try {
        const userId = req.user.id;
        const { category, type, comment } = req.body;

        if (!category || !type) {
            return res.status(400).json({ success: false, message: "Category and Type are required." });
        }

        // We check if the table exists or not is not ideal, but for hackathon let's just try inserting.
        // We ensure table exists:
        await pool.query(`
            CREATE TABLE IF NOT EXISTS feedbacks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                category VARCHAR(255) NOT NULL,
                type ENUM('like', 'dislike') NOT NULL,
                comment TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.query(
            'INSERT INTO feedbacks (user_id, category, type, comment) VALUES (?, ?, ?, ?)',
            [userId, category, type, comment || '']
        );

        return res.status(200).json({ success: true, message: "Feedback submitted successfully." });
    } catch (error) {
        console.error("Feedback Submission Error:", error);
        return res.status(500).json({ success: false, message: "Failed to submit feedback.", error: error.message });
    }
};

const getAllFeedback = async (req, res) => {
    try {
        // Only admin should call this (simplified check by assuming caller is authorized)
        const [rows] = await pool.query(`
            SELECT f.*, u.name as user_full_name, u.username as user_handle, u.department
            FROM feedbacks f
            LEFT JOIN users u ON f.user_id = u.id
            ORDER BY f.created_at DESC
        `);

        return res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error("Fetch Feedback Error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch feedback." });
    }
};

const updateProfilePhoto = async (req, res) => {
    try {
        const userId = req.user.id;
        const { photoBase64 } = req.body;

        if (!photoBase64) {
            return res.status(400).json({ success: false, message: "Photo data missing." });
        }

        // Sync with users table (Assuming column 'profile_picture' exists, we should probably add it)
        await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture LONGTEXT");
        
        await pool.query('UPDATE users SET profile_picture = ? WHERE id = ?', [photoBase64, userId]);

        return res.status(200).json({ success: true, message: "Profile photo updated successfully." });
    } catch (error) {
        console.error("Profile Photo Update Error:", error);
        return res.status(500).json({ success: false, message: "Failed to update profile photo." });
    }
};

module.exports = { submitFeedback, getAllFeedback, updateProfilePhoto };
