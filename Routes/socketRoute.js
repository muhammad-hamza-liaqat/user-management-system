const express = require("express");
const socketRoutes = express.Router();
const sendMessage = require("../Socket.io/chatGPTModel")

socketRoutes.route("/sendMessage").post(sendMessage)

module.exports = socketRoutes;
