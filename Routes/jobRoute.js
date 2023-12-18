const express = require("express");
const { handleFileUpload, submitForm ,applyJob, downloadResume } = require("../Controllers/jobController");

const jobRouter = express.Router();

jobRouter.route("/apply-job").get(applyJob).post(handleFileUpload, submitForm);
jobRouter.route("/download-cv/:id").get(downloadResume)

module.exports = jobRouter;
