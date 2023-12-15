const express = require("express");
const { applyJobPage, applyJob } = require("../Controllers/jobController");
const jobRouter = express.Router();

jobRouter.route("/apply-job").get(applyJobPage).post(applyJob);

module.exports = jobRouter;
