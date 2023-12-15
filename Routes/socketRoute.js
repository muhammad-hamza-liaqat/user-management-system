const express = require("express");
const socketRoutes = express.Router();
// const socketController = require('../controller/socketController');
const { sendMessage } = require("../Controllers/socketController")
socketRoutes.route("/sendMessage").post(sendMessage)

module.exports = socketRoutes;
