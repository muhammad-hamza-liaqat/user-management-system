const express = require("express");
const socketRoutes = express.Router();
const sendMessage = require("../Socket.io/chatGPTModel");
const { checkJWT } = require("../Middleware/adminAuthJWT");

socketRoutes.route("/sendMessage").post(checkJWT,sendMessage)

module.exports = socketRoutes;
