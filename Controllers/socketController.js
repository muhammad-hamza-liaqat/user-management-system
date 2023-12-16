// socketController.js
const io = require("socket.io")();
const { queryChatGPT } = require("../Services/queryChatGPT");

const sendMessagePage = (req, res) => {
  res.end("sendMessagePage render()");
};

const sendMessage = async (req, res) => {
  const prompt = req.body.message;

  try {
    // Call the OpenAI API to generate a response
    const generatedResponse = await queryChatGPT(prompt);

    // Emit the generated response to all connected clients
    io.emit("chat message", generatedResponse);

    // Send a structured JSON response
    res.status(200).json({
      prompt: prompt,
      answer: generatedResponse
    });
  } catch (error) {
    console.error("Error generating response:", error);

    // Send an error response
    res.status(500).json({
      error: "Internal Server Error"
    });
  }
};

module.exports = {
  sendMessage,
  sendMessagePage,
};
