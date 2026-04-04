const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function testOpenAI() {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "Say hello" },
            ],
        });
        console.log('OpenAI connection successful:', completion.choices[0].message.content);
        process.exit(0);
    } catch (error) {
        console.error('OpenAI connection failed:', error.message);
        process.exit(1);
    }
}

testOpenAI();
