require('dotenv').config();
console.log('PORT:', process.env.PORT);
console.log('API KEY:', process.env.OPENAI_API_KEY ? 'DEFINED' : 'UNDEFINED');
