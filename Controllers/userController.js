const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const getUser = async (req, res) => {
  res.status(200).json({ message: "hello from add-user Controller" });
};

const createUser = async (req, res) => {
  // res.end("add user post method")
  const { firstName, lastName, email, password } = req.body;
  try {
    await userModel.sync();
    // rememberToekn for the user to verify himself against this token
    const rememberTokenForUser = {
      token: uuidv4(),
      createdAt: new Date(),
    };
    // hashing the password and generate 10 rounds of salt for password decryption
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = await userModel.create({
      ...req.body,
      password: hashedPassword,
      rememberToken: rememberTokenForUser.token,
      isAdmin: false,
      isVerified: false,
    });

    console.log("user Created Successfully!", newUser);
    res.status(200).json({ message: "user created!" });
  } catch (error) {
    console.log("error: ", error.message);
  }
};

const isValidToken = (tokenObject) => {
  const createdAt = new Date(tokenObject.createdAt);
  const currentTime = new Date();
  const elapsedMilliseconds = currentTime - createdAt;
  const elapsedMinutes = elapsedMilliseconds / (1000 * 60);
  return elapsedMinutes <= 1;
};

const verifyUserToken = async (req, res) => {
  const { email, rememberToken } = req.body;
  try {
    const user = await userModel.findOne({ where: { email: email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid email entered!" });
    }
    if (isValidToken({ createdAt: user.createdAt })) {
      if (user.rememberToken === rememberToken) {
        user.rememberToken = null;
        user.isVerified = true;
        user.save();
        return res.status(200).json({ message: "user verified!" });
      }
    }
    else {
        return res.status(403).json({message: "token has expired"})
    }
    return res.status(403).json({ message: "invalid token!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "something went wrong! internal server error" });
  }
};

const userLogin = async (req, res) => {
  // res.end("hello from user login controller");
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({
      where: {
        email: email,
      },
    });
    // user doesnot exists
    if (!user) {
      return res.status(401).json({ message: "Invalid Email or Password!" });
    }
    const validatePassword = await bcrypt.compare(password, user.password);
    // incorrect password
    if (!validatePassword) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }
    console.log("user login successfully!");
    return res.status(200).json({ message: "login successfully!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "something went wrong! Internal Server Error" });
  }
};

module.exports = { getUser, createUser, verifyUserToken, userLogin };
