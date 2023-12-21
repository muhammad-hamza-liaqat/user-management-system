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
const apiResponse = require("../Middleware/responseFormat");

// Define storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the destination folder where the uploaded files will be stored
    cb(null, "uploads/");
  },
  // defining the name of the cv to be stored
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
      return res.sendError({ message: "File upload error" }, 400);
    } else if (err) {
      return res.sendError({ message: "Internal server error" }, 500);
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
    if (
      !userName ||
      !email ||
      !qualification ||
      !cnic ||
      !address ||
      !phoneNumber ||
      !cvPath
    ) {
      const pdfPath = `/home/hamza/Desktop/final_project/uploads/${email}.pdf`;
      // Check if the CV file exists before attempting to delete
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      }

      return res.status(400).json({ message: "all fields are required" });
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

    return res.sendSuccess(
      { message: "Applicant created successfully", newApplicant },
      201
    );
  } catch (error) {
    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      const errorMessage =
        error.errors && error.errors.length > 0
          ? error.errors[0].message
          : "Validation error";
      return res.sendError(
        { message: " Error occured", error: errorMessage },
        400
      );
    }

    console.error("Error creating applicant:", error);
    return res.sendError({ message: "Internal server error" }, 500);
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
      return res.sendError({ message: "resume not found" }, 404);
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
      res.sendError({ message: "resume not found" }, 404);
    }
  } catch (error) {
    console.error("Error downloading CV:", error);
    res.sendError({ message: "Internal server error", error: error }, 500);
  }
};

const findAllApplications = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || "";
    const status = req.query.status || "";
    const offset = (page - 1) * limit;

    // Specify the attributes you want to retrieve
    const attributesToRetrieve = [
      "userName",
      "email",
      "cnic",
      "cv",
      "status",
      "createdAt"
    ];

    // Adjust the status conditions as needed
    const whereClause = {
      [Op.and]: [
        {
          [Op.or]: [
            { userName: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
          ],
        },
        {
          status: {
            [Op.or]: status ? { [Op.eq]: status } : { [Op.in]: ['accepted', 'pending', 'rejected'] },
          },
        },
      ],
    };

    const applicants = await jobModel.findAndCountAll({
      attributes: attributesToRetrieve, 
      where: whereClause,
      offset,
      limit,
    });

    if (!applicants) {
      return res.sendError({ message: "No applicant found!" }, 400);
    }

    const totalPages = Math.ceil(applicants.count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    const pagination = {
      totalApplicants: applicants.count,
      currentPage: page,
      totalPages: totalPages,
    };
    res.sendSuccess(
      {
        message: "Data fetched successfully!",
        data: applicants.rows,
        pagination: pagination,
      },
      200
    );
  } catch (error) {
    res.sendError(
      {
        message: error.message,
      },
      400
    );
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
      return res.sendError(
        { message: "No application exists against this token" },
        404
      );
    }
    if (applicationAccept.status === "accepted") {
      return res.sendError({ message: "Already accepted" }, 409);
    }
    if (applicationAccept.status === "rejected") {
      return res.sendError(
        {
          message: "This application cannot be accepted as it is rejected",
        },
        404
      );
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
    res.sendSuccess(
      {
        message: "Application has been accepted. Congratulations!",
        applicantId: applicationAccept.id,
        applicantName: applicationAccept.userName,
        applicationStatus: applicationAccept.status,
      },
      200
    );
  } catch (error) {
    console.error(error);
    res.sendError({ message: "Internal Server Error", error: error }, 500);
  }
};

const rejectApplication = async (req, res) => {
  const id = req.params.id;
  try {
    let applicationRejected = await jobModel.findOne({
      where: { applicantId: id },
    });

    if (!applicationRejected) {
      return res.sendError(
        { message: "No application exists against this token" },
        404
      );
    }

    if (applicationRejected.status === "rejected") {
      return res.sendError({ message: "already rejected." }, 409);
    }

    if (applicationRejected.status === "accepted") {
      return res.sendError(
        {
          message:
            "cannot reject the application because it is already accepted",
        },
        400
      );
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
    }

    const rejectionContent = `
    <html>
  <head>
    <title>Job Application Rejection</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f0f8ff;">
    <div style="background-color: #98fb98; padding: 20px; border-radius: 10px;">
      <h2 style="color: #006400;">Job Application Status</h2>
      <p>We appreciate the time and effort you put into applying for the position at Priciple Software Engineer. After careful consideration, we regret to inform you that your application has not been successful at this time.</p>
      <p>We want to thank you for your interest in joining our team, and we encourage you to apply for future opportunities that match your skills and experience.</p>
      <p>If you have any questions or would like feedback on your application, feel free to reach out to our HR department at <u>hr@dsstudios.com</u>.</p>
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

    res.sendSuccess({ message: "Application has been rejected." }, 200);
  } catch (error) {
    console.log("error", error);
    res.sendError({ message: "Internal Server Error", error: error }, 500);
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
