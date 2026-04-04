const express = require('express');
const router = express.Router();
const { practiceLanguage, getPracticeHistory, translateLanguage } = require('../controllers/languageController');
const { authenticateJWT } = require('../middleware/auth');

// Language Practice Actions
router.post('/practice', authenticateJWT, practiceLanguage);
router.get('/history', authenticateJWT, getPracticeHistory);
router.post('/translate', translateLanguage);

module.exports = router;
