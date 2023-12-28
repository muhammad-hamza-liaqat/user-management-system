const express = require("express");
const socketRoutes = express.Router();
const sendMessage = require("../Socket.io/chatGPTModel");
const { checkJWT } = require("../Middleware/adminAuthJWT");
const isthisUser = require("../Middleware/isUserAuth");
socketRoutes.route("/sendMessage").post(checkJWT,isthisUser,sendMessage)

module.exports = socketRoutes;
