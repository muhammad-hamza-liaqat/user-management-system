const express = require("express");
const socketRoutes = express.Router();
// const socketController = require('../controller/socketController');
const { sendMessage, sendMessagePage } = require("../Controllers/socketController")
socketRoutes.route("/sendMessage").get(sendMessagePage).post(sendMessage)

module.exports = socketRoutes;
