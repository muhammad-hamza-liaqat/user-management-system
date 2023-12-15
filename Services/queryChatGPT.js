const axios = require('axios');

const apiKey = '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';
const apiUrl = 'https://api.openai.com/v1/engines/davinci/completions';

async function queryChatGPT(prompt) {
  try {
    const response = await axios.post(apiUrl, {
      prompt: prompt,
      max_tokens: 100,
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
    } else {
      console.error(`Error: ${response.status} - ${response.data.error.message}`);
      return null;
    }
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}

module.exports = { queryChatGPT };
