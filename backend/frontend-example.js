/**
 * ========================================================
 * EXAMPLE API USAGE (Frontend JS / React / Vue)
 * ========================================================
 * 
 * You can drop this function into your frontend project to call
 * the AI recommendation endpoint. Make sure you pass the stored JWT token.
 */

async function fetchAiRecommendations(jwtToken) {
    try {
        console.log("Requesting customized recommendations...");

        const response = await fetch('http://localhost:5000/api/ai/recommendations', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // This authorization header triggers the JWT auth middleware to identify the user
                'Authorization': `Bearer ${jwtToken}`
            }
        });

        // Ensure we handle non-200 responses safely
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                 throw new Error("Authentication failed. Please login again.");
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success) {
            // Expected Output mapping
            console.log("Next Skill:", result.data.nextSkill);
            console.log("Next Project:", result.data.nextProject);
            console.log("Next Event:", result.data.nextEvent);
            
            // e.g. update React state: setRecommendations(result.data);
            return result.data;
        } else {
            console.error("AI Error:", result.message);
        }

    } catch (error) {
        console.error("Fetch Exception:", error);
    }
}

/**
 * ========================================================
 * POSTMAN TESTING GUIDE
 * ========================================================
 * 1. Open Postman.
 * 2. Create a new request and select method: GET.
 * 3. Enter URL: http://localhost:5000/api/ai/recommendations
 * 4. Go to the "Headers" tab.
 * 5. Add a new key-value pair:
 *    - Key: Authorization
 *    - Value: Bearer <YOUR_TEST_JWT_TOKEN>
 * 6. Hit "Send".
 * 
 * Expected JSON Response:
 * {
 *   "success": true,
 *   "data": {
 *      "nextSkill": "React Hooks",
 *      "nextProject": "Interactive Todo App",
 *      "nextEvent": "Addis Coder Backend Bootcamp"
 *   }
 * }
 */
