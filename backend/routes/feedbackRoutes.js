const express = require('express');
const router = express.Router();
const { submitFeedback, getAllFeedback, updateProfilePhoto } = require('../controllers/feedbackController');
const { authenticateJWT } = require('../middleware/auth');

// Public endpoints (still need authentication to identify user)
router.post('/submit', authenticateJWT, submitFeedback);
router.post('/update-photo', authenticateJWT, updateProfilePhoto);

// Admin endpoints
router.get('/admin/all', authenticateJWT, getAllFeedback);

module.exports = router;
