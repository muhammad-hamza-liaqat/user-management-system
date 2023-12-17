const jobModel = require("../Models/jobModel");

const applyJobPage = (req, res) => {
  res.end("applyJob render()");
};
const applyJob = async (req, res) => {
  const { userName, qualification, email, cnic, phoneNumber, status, cv, age } = req.body;

  try{
    if (!userName && !qualification, !email, !cnic, !phoneNumber, !status, !cv, !age){
      return res.status(400).json({message: "All fields are required!"})
    }

    const newApplicant = await jobModel({
      username: userName,
      qualification: qualification,
      email: email,
      cnic: cnic,
      phonenumber: phoneNumber,
      applicationStatus: status,
      cv: cv,
      age: age
    });
    console.log("applicant created: ", newApplicant);
    return res.status(200).json({message: "new applicant created"})

  }catch(error){
    return res.status(500).json({message: "Interval Server Error"})
  }
};

module.exports = { applyJobPage, applyJob };
