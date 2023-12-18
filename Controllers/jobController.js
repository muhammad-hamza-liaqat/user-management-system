const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const jobModel = require("../Models/jobModel");
const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");

// Define storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the destination folder where the uploaded files will be stored
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Customize the filename to include the email address with PDF extension
    const email = req.body.email || "default"; // Use a default value if email is not available
    const fileName = `${email}.pdf`;
    cb(null, fileName);
  },
});

// Create the multer middleware with the defined storage
const upload = multer({ storage: storage }).single("cv");

const handleFileUpload = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: "File upload error" });
    } else if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
    next();
  });
};

const submitForm = async (req, res) => {
  const {
    userName,
    email,
    qualification,
    cnic,
    address,
    phoneNumber,
    status,
    age,
    isDelete,
  } = req.body;

  let cvPath = "";
  if (req.file) {
    cvPath = req.file.path;
  }

  try {
    const newApplicant = await jobModel.create({
      applicantId: uuidv4(),
      userName,
      email,
      qualification,
      cnic,
      address,
      phoneNumber,
      cv: cvPath,
      status,
      age,
      isDelete,
    });

    return res
      .status(201)
      .json({ message: "Applicant created successfully", data: newApplicant });
  } catch (error) {
    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      const errorMessage =
        error.errors && error.errors.length > 0
          ? error.errors[0].message
          : "Validation error";
      return res.status(400).json({ error: errorMessage });
    }

    console.error("Error creating applicant:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const applyJob = (req, res) => {
  res.end("hello from the applyJob controller");
};

const downloadResume = async (req, res) => {
  const { id } = req.params;
  try {
    const applicant = await jobModel.findOne({
      where: {
        applicantId: id,
      },
    });
    if (!applicant) {
      return res.status(404).send("CV not found");
    }
    const cvFilePath = applicant.cv;
    console.log(cvFilePath);
    console.log("CV File Path:", cvFilePath);
    if (fs.existsSync(cvFilePath)) {
      const fileExtension = path.extname(applicant.cv);

      const applicantEmail = applicant.email;

      const sanitizedEmail = applicantEmail.replace(/[@.]/g, "_");

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${sanitizedEmail}_CV${fileExtension}"`
      );
      res.setHeader("Content-Type", "application/pdf");

      const fileStream = fs.createReadStream(cvFilePath);
      fileStream.pipe(res);
    } else {
      res.status(404).send("CV file not found");
    }
  } catch (error) {
    console.error("Error downloading CV:", error);
    res.status(500).send("Internal server error");
  }
};

const findAllApplications = async (req, res) => {
  try {
    const all = await jobModel.findAll({
      attributes: ["applicantId", "userName", "email", "qualification", "cnic", "address", "phoneNumber", "status"],
      where: {
        status: {
          // find only pending and accepted appplicants only
          [Op.or]: ["pending", "accepted"],
        },
      },
    });
    res.status(200).json(all);
  } catch (error) {
    console.log("error:", error),
      res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  handleFileUpload,
  submitForm,
  applyJob,
  downloadResume,
  findAllApplications,
};
