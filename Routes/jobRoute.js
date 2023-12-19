const express = require("express");
const { handleFileUpload, submitForm ,applyJob, downloadResume, findAllApplications, acceptApplication, rejectApplication } = require("../Controllers/jobController");
const { checkJWT} = require("../Middleware/adminAuthJWT")
const jobRouter = express.Router();

jobRouter.route("/apply-job").get(applyJob).post(checkJWT,handleFileUpload, submitForm);
jobRouter.route("/download-cv/:id").get(checkJWT,downloadResume);
jobRouter.route("/all-Applications").get(checkJWT,findAllApplications);
jobRouter.route("/accept/:id").get(checkJWT,acceptApplication);
jobRouter.route("/reject/:id").get(checkJWT,rejectApplication);
module.exports = jobRouter;
