const axios = require("axios");

const sendMessage = async (req, res) => {
  try {
    const openaiEndpoint = "https://api.openai.com/v1/chat/completions";
    const openaiApiKey = "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";
    const response = await axios.post(
      openaiEndpoint,
      {
        messages: [{ role: "user", content: req.body.question }],
        model: "gpt-3.5-turbo",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApiKey}`,
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error:", error.message);
  }
};

module.exports = sendMessage;
