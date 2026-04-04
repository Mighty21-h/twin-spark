const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const aiRoutes = require('./routes/aiRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const languageRoutes = require('./routes/languageRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());          // Allow cross-origin requests from frontend apps
app.use(express.json({ limit: '50mb' }));  // Increased limit for Base64 photo uploads

// Define Routes
app.use('/api/ai', aiRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/languages', languageRoutes);

// Base route for sanity check
app.get('/', (req, res) => {
    res.send('Bilih Smart Link Backend Engine is active.');
});

// Mock Chat Integration (Replaces Gemini)
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    res.json({ reply: "This is a simulated AI assistant response. The Gemini backend has been removed as requested." });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Bilih Backend API running on http://localhost:${PORT}`);
});
