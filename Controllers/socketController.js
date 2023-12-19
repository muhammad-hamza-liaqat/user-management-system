// const io = require("socket.io")();
// const { queryChatGPT } = require("../Services/queryChatGPT");
// const Chat = require("../Models/chatModel");

// const sendMessagePage = (req, res) => {
//   res.end("sendMessagePage render()");
// };

// const sendMessage = async (req, res) => {
//   const userEmail = req.body.userEmail;
//   const message = req.body.message;

//   try {
//     // Call the OpenAI API to generate a response
//     const generatedResponse = await queryChatGPT(message);

//     // Check if generatedResponse is not null before saving to the database
//     if (generatedResponse !== null) {
//       // Save the message and response to the database
//       const chatEntry = await Chat.create({
//         email: userEmail,
//         question: message,
//         answers: generatedResponse,
//       });
//       console.log('generated response:', generatedResponse);

//       // Emit the generated response to all connected clients
//       io.emit("chat message", generatedResponse);

//       // Send a structured JSON response
//       res.status(200).json({
//         userEmail: userEmail,
//         question: message,
//         answers: generatedResponse,
//       });
//     } else {
//       console.error('Generated response is null. Skipping database insertion.');
//       // Send an appropriate response or handle the null case as needed
//       res.status(500).json({
//         error: "Internal Server Error",
//         errorMessage: "Generated response is null.",
//       });
//     }
//   } catch (error) {
//     console.error("Error generating response:", error);
//     console.error("Full error object:", error);

//     try {
//       // Save the error to the database (optional, depending on your requirements)
//       const chatEntryWithError = await Chat.create({
//         email: userEmail,
//         question: message,
//         error: error.message,
//       });
//     } catch (saveError) {
//       console.error("Error saving error to the database:", saveError);
//     }

//     // Send an error response with the error message
//     res.status(500).json({
//       error: "Internal Server Error",
//       errorMessage: error.message,
//     });
//   }
// };

// module.exports = {
//   sendMessage,
//   sendMessagePage,
// };
