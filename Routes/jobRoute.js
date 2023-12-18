const express = require("express");
const { handleFileUpload, submitForm ,applyJob } = require("../Controllers/jobs");

const jobRouter = express.Router();

jobRouter.route("/apply-job").get(applyJob).post(handleFileUpload, submitForm);

module.exports = jobRouter;
