const express = require("express");
const getLogs = require("../Controllers/logController");
const logRouter = express.Router();
const {adminCheckJWT} = require("../Middleware/adminAuthJWT")

logRouter.route("/activity-logs").get(adminCheckJWT,getLogs);

module.exports = logRouter