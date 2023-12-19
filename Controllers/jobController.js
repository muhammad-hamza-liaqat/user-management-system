const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const jobModel = require("../Models/jobModel");
const fs = require("fs");
const path = require("path");
const { Op, where } = require("sequelize");
const {
  transporter,
  sendVerificationEmail,
  rejectedApplication,
} = require("../Services/rejectedApplication");

// Define storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the destination folder where the uploaded files will be stored
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Customize the filename to include the email address with PDF extension
    const email = req.body.email || "default"; 
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
    if (!userName || !email || !qualification || !cnic || !address || !phoneNumber || !cvPath){
      return res.status(400).json({message: "all fields are required"})
    }
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
    
    const { status, page, pageSize } = req.query;
    const pageSizeInt = parseInt(pageSize, 10) || 10;

    
    const whereClause = {};
    if (status) {
      whereClause.status = {
        [Op.in]: status.split(","), 
      };
    } else {
      // If no status filter provided, default to "pending" and "accepted"
      whereClause.status = {
        [Op.or]: ["accepted", "pending", "rejected"],
      };
    }

    
    const offset = (page - 1) * pageSizeInt;
    const limit = pageSizeInt;

    
    const all = await jobModel.findAndCountAll({
      attributes: [
        "applicantId",
        "userName",
        "email",
        "qualification",
        "cnic",
        "address",
        "phoneNumber",
        "status",
      ],
      where: whereClause,
      offset,
      limit,
    });

    const response = {
      totalRecords: all.count,
      totalPages: Math.ceil(all.count / pageSizeInt),
      currentPage: page,
      pageSize: pageSizeInt,
      data: all.rows,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const acceptApplication = async (req, res) => {
  const id = req.params.id;
  try {
    const applicationAccept = await jobModel.findOne({
      where: {
        applicantId: id,
      },
    });
    if (!applicationAccept) {
      return res
        .status(404)
        .json({ message: "No application exists against this token" });
    }
    if (applicationAccept.status === "accepted") {
      return res.status(409).json({ message: "Already accepted" });
    }
    if (applicationAccept.status === "rejected") {
      return res.status(404).json({
        message: "This application cannot be accepted as it is rejected",
      });
    }

    // Update the status of the found application
    await jobModel.update(
      { status: "accepted" },
      {
        where: {
          applicantId: id,
        },
      }
    );

    console.log(applicationAccept);
    res
      .status(200)
      .json({ message: "Application has been accepted. Congratulations!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const rejectApplication = async (req, res) => {
  const id = req.params.id;
  try {
    let applicationRejected = await jobModel.findOne({
      where: { applicantId: id },
    });

    if (!applicationRejected) {
      return res
        .status(404)
        .json({ message: "No application exists against this token" });
    }

    if (applicationRejected.status === "rejected") {
      return res
        .status(409)
        .json({ message: "already rejected." });
    }

    if (applicationRejected.status === "accepted") {
      return res.status(400).json({ message: "cannot reject the application because it is already accepted" });
    }

    if (applicationRejected.status === "pending") {
      await jobModel.update(
        { status: "rejected" },
        {
          where: {
            applicantId: id,
          },
        }
      );
    };

    const rejectionContent = `
    <html>
      <head>
        <title>Job Application Rejection</title>
      </head>
      <body style="font-family: Arial, sans-serif;">
  
        <div style="background-color: #f2f2f2; padding: 20px; border-radius: 10px;">
          <h2 style="color: #333;">Job Application Status</h2>
          <p>We appreciate the time and effort you put into applying for the position at XYZ Company. After careful consideration, we regret to inform you that your application has not been successful at this time.</p>
          <p>We want to thank you for your interest in joining our team, and we encourage you to apply for future opportunities that match your skills and experience.</p>
          <p>If you have any questions or would like feedback on your application, feel free to reach out to our HR department at hr@example.com.</p>
          <p>Thank you again, and we wish you the best in your job search.</p>
        </div>
      </body>
    </html>
  `;

  await rejectedApplication.add({
    to: applicationRejected.email,
    subject: "Application Rejected",
    text: "this email is about the status of your job application",
    html: rejectionContent,
  });


    res.status(200).json({ message: "Application has been rejected." });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  handleFileUpload,
  submitForm,
  applyJob,
  downloadResume,
  findAllApplications,
  acceptApplication,
  rejectApplication,
};
