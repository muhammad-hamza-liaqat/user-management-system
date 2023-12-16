const axios = require('axios');

const apiKey = 'your open ai key here';
const apiUrl = 'https://api.openai.com/v1/engines/davinci/completions';

async function queryChatGPT(prompt, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.post(apiUrl, {
        prompt: prompt,
        max_tokens: 4096,
        temperature: 0.7,
        stop: '\n'
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      });

      if (response.status === 200) {
        return response.data.choices[0].text;
      } else if (response.status === 429) {
        const statusCode = response.status;
        console.log(`Rate limited (Status Code: ${statusCode}). Retrying in ${delay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; 
      } else {
        console.error(`Error: ${response.status} - ${response.data.error.message}`);
      }
    } catch (error) {
      // If the request was made and received a response but contains an error
      if (error.response && error.response.status === 429) {
        const statusCode = error.response.status;
        console.log(`Rate limited (Status Code: ${statusCode}). Retrying in ${delay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; 
      } else {
        const statusCode = error.response ? error.response.status : 'unknown';
        console.error(`Error: ${statusCode} - ${error.message}`);
      }
    }
  }

  console.error('Max retries reached. Unable to get a response.');
  return null;
}

module.exports = { queryChatGPT };
