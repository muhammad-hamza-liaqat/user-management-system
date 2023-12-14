const userModel = require("../Models/userModel");

const getUser = async (req, res) => {
  res.status(200).json({ message: "hello from add-user Controller" });
};
const createUser = async (req, res) => {
  // res.end("add user post method")
  const { firstName, lastName, email, password } = req.body;
  try{
    const newUser = await userModel.create({
        firstName,
        lastName,
        email,
        password
    });
    console.log("user created successfully!");
    res.status(200).json({message: "user created!"})
  }
  catch(error){
    console.log("error: ", error.message);
  }
};

module.exports = { getUser, createUser };
