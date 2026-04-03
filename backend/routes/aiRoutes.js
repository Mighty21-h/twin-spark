const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controllers/aiController');
const { authenticateJWT } = require('../middleware/auth');

// GET /api/ai/recommendations
// Access: PROTECTED (Requires valid JWT token)
router.get('/recommendations', authenticateJWT, getRecommendations);

module.exports = router;
