const express = require("express");
const getLogs = require("../Controllers/logController");
const logRouter = express.Router();


logRouter.route("/get-logs").get(getLogs);

module.exports = logRouter