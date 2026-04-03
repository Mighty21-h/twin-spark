const express = require('express');
const router = express.Router();
const { practiceLanguage, getPracticeHistory } = require('../controllers/languageController');
const { authenticateJWT } = require('../middleware/auth');

// Language Practice Actions
router.post('/practice', authenticateJWT, practiceLanguage);
router.get('/history', authenticateJWT, getPracticeHistory);

module.exports = router;
