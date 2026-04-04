const express = require('express');
const router = express.Router();
const { getRecommendations, getGPASuggestions, generateStudySchedule } = require('../controllers/aiController');
const { authenticateJWT } = require('../middleware/auth');

// GET /api/ai/recommendations
// Access: PROTECTED (Requires valid JWT token)
router.get('/recommendations', authenticateJWT, getRecommendations);

// POST /api/ai/gpa-suggestions
router.post('/gpa-suggestions', authenticateJWT, getGPASuggestions);

// POST /api/ai/generate-schedule
router.post('/generate-schedule', authenticateJWT, generateStudySchedule);

module.exports = router;
