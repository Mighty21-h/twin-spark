const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        // Extract the token assuming "Bearer <token>" format
        const token = authHeader.split(' ')[1];

        // 🟢 DEVELOPMENT/HACKATHON FALLBACK: 
        // If the token is a JSON object (mock session), parse it directly. 
        // In a production app, we would ONLY use jwt.verify.
        if (token && (token.startsWith('{') || token.startsWith('%7B'))) {
            try {
                const decodedToken = decodeURIComponent(token);
                const mockUser = JSON.parse(decodedToken);
                req.user = mockUser;
                return next();
            } catch (e) {
                // Fall through to real JWT check if JSON parse fails
            }
        }

        // Verify the JWT token
        jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key', (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Invalid or expired token. Access denied." });
            }
            
            // Attach decoded payload (usually contains user ID) to the request context
            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ message: "Authentication token missing." });
    }
};

module.exports = { authenticateJWT };
