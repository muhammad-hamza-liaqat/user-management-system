const express = require("express");
const { handleFileUpload, submitForm ,applyJob, downloadResume, findAllApplications, acceptApplication, rejectApplication } = require("../Controllers/jobController");
const { checkJWT} = require("../Middleware/adminAuthJWT")
const jobRouter = express.Router();

jobRouter.route("/apply-job").get(applyJob).post(handleFileUpload, submitForm);
jobRouter.route("/download-cv/:id").get(checkJWT,downloadResume);
jobRouter.route("/get-job-applications").get(checkJWT,findAllApplications);
jobRouter.route("cv/accept/:id").get(checkJWT,acceptApplication);
jobRouter.route("cv/reject/:id").get(checkJWT,rejectApplication);
module.exports = jobRouter;
