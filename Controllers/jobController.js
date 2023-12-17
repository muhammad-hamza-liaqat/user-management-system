const express = require("express");
const fileUpload = require("express-fileupload");
const app =   express();
app.use(fileUpload());
const jobModel = require("../Models/jobModel");



const applyJobPage = (req, res) => {
  res.end("applyJob render()");
};


const applyJob = async (req, res) => {
  const { userName, qualification, email, cnic, phoneNumber, age } = req.body;

  try {
    console.log(req.body); // Log the entire request body
    console.log(userName, qualification, email, cnic, phoneNumber, age); // Log individual fields

    if (!userName || !qualification || !email || !cnic || !phoneNumber || !age) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // if (!req.files || Object.keys(req.files).length === 0) {
    //   return res.status(400).json({ message: 'No files were uploaded.' });
    // }

    const cvFile = req.files.cv;
    const cvPath = `${__dirname}/../Uploads/${cvFile.name}`;

    cvFile.mv(cvPath, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'File upload failed.' });
      }

      const newApplicant = jobModel.create({
        userName,
        qualification,
        email,
        cnic,
        phoneNumber,
        cv: cvPath,
        age,
      });

      console.log("applicant created: ", newApplicant);
      return res.status(200).json({ message: "New applicant created" });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { applyJobPage, applyJob };