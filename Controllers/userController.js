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

    const newUser = await userModel.create({
      ...req.body,
      rememberToken: rememberTokenForUser.token,
      isAdmin: false,
      isVerified: false,
    });

    const htmlContent = `
    <html>
      <head>
        <title>Email Verification</title>
      </head>
      <body style="font-family: Arial, sans-serif;">
  
        <div style="background-color: #f2f2f2; padding: 20px; border-radius: 10px;">
          <h2 style="color: #333;">Email Verification</h2>
          <p>Thank you for signing up! To complete your registration, please click the button below to verify your email address:</p>
          <a href="http://localhost:3000/users/verify-user/${email}/${rememberTokenForUser.token}" target="_blank" style="text-decoration: none;">
            <button style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
              Verify Email
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
    console.log("error: ", error.message);
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

const verifyUserToken = async (req, res) => {
  console.log(req.params);
  const email = req.params.email
  const rememberToken = req.params.rememberToken
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

const setPassword = async(req,res) =>{
  const {email, password} = req.body
}


module.exports = { getUser, createUser, verifyUserToken, userLogin, setPassword };
