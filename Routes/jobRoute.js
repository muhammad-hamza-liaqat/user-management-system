const express = require("express");
const { handleFileUpload, submitForm ,applyJob, downloadResume, findAllApplications, acceptApplication, rejectApplication } = require("../Controllers/jobController");

const jobRouter = express.Router();

jobRouter.route("/apply-job").get(applyJob).post(handleFileUpload, submitForm);
jobRouter.route("/download-cv/:id").get(downloadResume);
jobRouter.route("/all-Applications").get(findAllApplications);
jobRouter.route("/accept/:id").get(acceptApplication);
jobRouter.route("/reject/:id").get(rejectApplication);
module.exports = jobRouter;
