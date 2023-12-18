const express = require("express");
const fileUpload = require("express-fileupload");
const app =   express();
app.use(fileUpload());
const jobModel = require("../Models/jobModel");



const applyJobPage = (req, res) => {
  res.end("applyJob render()");
};


const applyJob = async (req, res) => {
  
};

module.exports = { applyJobPage, applyJob };