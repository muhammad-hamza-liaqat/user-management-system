const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const schedule = require("node-schedule");
const {
  transporter,
  sendVerificationEmail,
  emailQueue,
} = require("../Services/nodeMailer.js");
const { where } = require("sequelize");

const getUser = async (req, res) => {
  res.status(200).json({ message: "hello from add-user Controller" });
};

const createUser = async (req, res) => {
  // res.end("add user post method")
  const { firstName, lastName, email } = req.body;
  try {
    await userModel.sync();
    // rememberToekn for the user to verify himself against this token
    const rememberTokenForUser = {
      token: uuidv4(),
      createdAt: new Date(),
    };

    const newUser = await userModel.create(
      {
        firstName,
        lastName,
        email,
        rememberToken: rememberTokenForUser.token,
        isAdmin: false,
        isVerified: false,
      },
      {
        fields: [
          "firstName",
          "lastName",
          "email",
          "rememberToken",
          "isAdmin",
          "isVerified",
        ],
      }
    );

    const htmlContent = `
    <html>
      <head>
        <title>Email Verification</title>
      </head>
      <body style="font-family: Arial, sans-serif;">
  
        <div style="background-color: #f2f2f2; padding: 20px; border-radius: 10px;">
          <h2 style="color: #333;">Email Verification</h2>
          <p>Thank you for signing up! To complete your registration, please click the button below to verify your email address:</p>
          <a href="http://localhost:8080/user/verify-user/${email}/${rememberTokenForUser.token}" target="_blank" style="text-decoration: none;">
            <button style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
              Verify Email & create password
            </button>
          </>
        </div>
      </body>
    </html>
  `;

    await emailQueue.add({
      to: newUser.email,
      subject: "Account Verification Email",
      text: "So delighted that you have sign-up to our website. Please cooperate with us for the sign in process",
      html: htmlContent,
    });

    res
      .status(201)
      .json({ message: "user created! Verify email to verify account" });
    console.log("user Created Successfully!", newUser);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const validationErrors = error.errors.map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({ errors: validationErrors });
    } else {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

// validator function to validate the token timestamp

const isValidToken = (tokenObject) => {
  const createdAt = new Date(tokenObject.createdAt);
  const currentTime = new Date();
  const elapsedMilliseconds = currentTime - createdAt;
  const elapsedMinutes = elapsedMilliseconds / (1000 * 60);
  return elapsedMinutes <= 30;
  //   the token will expire in 30 minutes after the generation
};

const createPasswordPage = (req, res) => {
  res.end("create password page");
};

const verifyUserToken = async (req, res) => {
  console.log(req.params);
  const email = req.params.email;
  const rememberToken = req.params.rememberToken;
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
        return res.redirect("http://localhost:8080/user/create-password");
      }
    } else {
      return res.status(403).json({ message: "token has expired" });
    }
    return res.status(403).json({ message: "invalid token!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "something went wrong! internal server error" });
  }
};
const loginPage = (req, res) => {
  res.end("loginPage");
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

const createPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ where: { email: email } });
    if (!user) {
      console.log("this user does not exist in the records");
      return res.status(500).json({ message: "user not found!" });
    }
    if (user.isVerified === false) {
      console.log("the user is not verified. please verify your account first");
      return res.status(406).json({
        message: "User is not Verified! Please verify your account first.",
      });
    }

    console.log(password);
    if (password === null || password === "") {
      console.log("Password is null or empty. No need to update.");
      return res
        .status(400)
        .json({ message: "Password cannot be null or empty." });
    } else {
      const hashedPassword = await bcrypt.hash(password, 15);
      await user.update({ password: hashedPassword });
      console.log(hashedPassword);
      return res.status(201).json({ message: "password created!" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went Wrong! Internal Server Error- createPassword",
    });
  }
};

const forgotPasswordPage = (req, res) => {
  res.end("forgotPasswordPage render()");
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userModel.findOne({ where: { email: email } });
    if (!user) {
      return res.status(400).json({ message: "record not found!" });
    }
    
    if (user.password===null || user.password==""){
      return res.status(400).json({message: "check your mail to set the password again- request hitted before"})
    }
    await user.update({ password: null });
    console.log("Mail sent to your email address. follow the instructions")
    const resetContent = `
    <html>
      <head>
        <title>Reset Password</title>
      </head>
      <body style="font-family: Arial, sans-serif;">
  
        <div style="background-color: #f2f2f2; padding: 20px; border-radius: 10px;">
          <h2 style="color: #333;">Email Verification</h2>
          <p>To Reset the Password, click on the link below:</p>
          <a href="http://localhost:8080/user/set-password/${email}" target="_blank" style="text-decoration: none;">
            <button style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
              Reset Password
            </button>
          </>
        </div>
      </body>
    </html>
  `;
    await emailQueue.add({
      to: user.email,
      subject: "Password Reset Email",
      text: "Hello App Family, you have generated the request for the reset email password",
      html: resetContent,
    });
    return res.status(201).json({message: "email sent check the email"})

  } catch (error) {
    console.log("error:", error);
    return res.status(500).json({ message: "internal server error" });
  }
};

const setPasswordPage =(req,res)=>{
  res.end("setPasswordPage render()")
};

const setPassword = async(req,res)=>{
  try{
    const {password} =req.body;
    const email = req.params.email;
    const user = await userModel.findOne({where:{ email: email}});
    if (!user){
      return res.status(400).json({message: "user don't exist"})
    }
    const hashedPassword =  await bcrypt.hash(password, 10);
    await user.update({ password: hashedPassword });
    return res.status(201).json({message: "user has successfully set the password"})
  } catch(error){
    console.log("error:",error);
    return res.status(500).json({message: "internal server error"})
  }
};

module.exports = {
  getUser,
  createUser,
  verifyUserToken,
  userLogin,
  createPassword,
  loginPage,
  createPasswordPage,
  forgotPasswordPage,
  forgotPassword,
  setPasswordPage,
  setPassword
};
