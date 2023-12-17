const jobModel = require("../Models/jobModel");

const applyJobPage = (req, res) => {
  res.end("applyJob render()");
};
const applyJob = async (req, res) => {
  const { userName, qualification, email, cnic, phoneNumber, cv, age } = req.body;
  console.log(req.body)
  try {
     if (!userName || !qualification || !email || !cnic || !phoneNumber || !cv || !age) {
        return res.status(400).json({ message: "All fields are required!" });
     }

     const newApplicant = await jobModel.create({
        userName,
        qualification,
        email,
        cnic,
        phoneNumber,
        cv,
        age,
     });

     console.log("applicant created: ", newApplicant);
     return res.status(200).json({ message: "new applicant created" });
  } catch (error) {
     console.error(error);
     return res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = { applyJobPage, applyJob };
