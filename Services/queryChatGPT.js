const axios = require('axios');

const apiKey = 'your open-ai api key';
const apiUrl = 'https://api.openai.com/v1/engines/davinci/completions';

async function queryChatGPT(prompt, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.post(apiUrl, {
        prompt: prompt,
        max_tokens: 2000,
        temperature: 1.0,
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
        const errorMessage = response.data.error ? response.data.error.message : 'Unknown error';
        console.error(`Error: ${response.status} - ${errorMessage}`);
        return `Error: ${response.status} - ${errorMessage}`;
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
        const errorMessage = error.response && error.response.data ? error.response.data.error.message : 'Unknown error';

        // Handle the specific error case for maximum context length
        if (statusCode === 400 && errorMessage.includes('maximum context length')) {
          console.error(`Error: ${statusCode} - ${errorMessage}`);
          return `Error: ${statusCode} - Please reduce your prompt or completion length.`;
        }

        console.error(`Error: ${statusCode} - ${errorMessage}`);
        return `Error: ${statusCode} - ${errorMessage}`;
      }
    }
  }

  console.error('Max retries reached. Unable to get a response.');
  return null;
}

module.exports = { queryChatGPT };
