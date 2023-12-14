const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const getUser = async (req, res) => {
  res.status(200).json({ message: "hello from add-user Controller" });
};
const createUser = async (req, res) => {
  // res.end("add user post method")
  const { firstName, lastName, email, password } = req.body;
  try{
    await userModel.sync();
    // rememberToekn for the user to verify himself against this token
    const rememberTokenForUser = uuidv4();
    // hashing the password and generate 10 rounds of salt for password decryption
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await userModel.create({
        ...req.body,
        password: hashedPassword,
        rememberToken: rememberTokenForUser,
        isAdmin: false,
        isVerified: false,
    });
    
    console.log("user Created Successfully!", newUser);
    res.status(200).json({message: "user created!"})
  }
  catch(error){
    console.log("error: ", error.message);
  }
};

const verifyUserToken = async(req,res)=>{
    res.end("hello from verify user controller");
}

module.exports = { getUser, createUser, verifyUserToken };
