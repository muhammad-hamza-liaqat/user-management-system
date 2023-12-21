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
const apiResponse = require("../Middleware/responseFormat");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const getUser = async (req, res) => {
  res.sendSuccess(200, "hello from add-user controller");
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

    // const verificationLink = `http://localhost:8080/#/UserDashboard/ConfirmPass/${email}`;
    const verificationLink = `http://localhost:8080/user/create-password/${email}`;
    const htmlContent = `<html>
      <head>
        <title>Email Verification</title>
      </head>
      <body style="font-family: Arial, sans-serif;">
  
        <div style="background-color: #f2f2f2; padding: 20px; border-radius: 10px;">
          <h2 style="color: #333;">Email Verification</h2>
          <p>Thank you for signing up! To complete your registration, please click the button below to verify your email address:</p>
          <a href=${verificationLink} target="_blank" style="text-decoration: none;">
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
    return res.sendSuccess({
      message: "user created successfully!",
      statusCode: 201,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      isVerified: newUser.isVerified,
      isAdmin: newUser.isAdmin,
    });
    console.log("user Created Successfully!", newUser);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const validationErrors = error.errors.map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return res.sendError({ errors: validationErrors }, 400);
    } else {
      console.error(error);
      return res.sendError({ error: "Internal Server Error" }, 500);
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
      return res.sendError({ message: "Invalid email entered!" }, 400);
    }

    if (isValidToken({ createdAt: user.createdAt })) {
      if (user.rememberToken === rememberToken) {
        user.rememberToken = null;
        user.isVerified = true;
        user.save();
        return res.sendSuccess(
          {
            message: "user Verified!",
            firstName: user.firstName,
            email: user.email,
            isVerified: user.isVerified,
          },
          200
        );
        // return res.redirect("http://localhost:8080/user/create-password");
      }
    } else {
      return res.sendError({ message: "token has expired" }, 401);
    }
    return res.sendError({ message: "invalid token!" }, 403);
  } catch (error) {
    return res.sendError({ message: "Interval Server Error" }, 500);
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
    if (!email){
      return res.sendError({message: "email is misssing"},400)
    }
    if (!password){
      return res.sendError({message: "email is misssing"},400)
    }
    if(user.password == null){
      return res.sendError({message: "account not verified"},400)
    }
    if (!user) {
      return res.sendError({ message: "Invalid Email or Password!" }, 401);
    }
    const validatePassword = await bcrypt.compare(password, user.password);
    // incorrect password
    if (!validatePassword) {
      return res.sendError({ message: "Invalid Email or Password" });
    }
    // adding the jwt token for the verification
    const token = jwt.sign(
      {
        userId: user.userId,
        username: user.firstName,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      process.env.Secret_KEY,
      { expiresIn: "2h" }
    );

    console.log("token:", token);
    return res.sendSuccess(
      {
        message: "User Login successfully",
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token: token,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified,
      },
      200
    );
  } catch (error) {
    return res.sendError(
      { message: "something went wrong! Internal Server Error" },
      500
    );
  }
};

const createPassword = async (req, res) => {
  const { email } = req.params;

  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  try {
    const user = await userModel.findOne({ where: { email: email } });
    if (!email){
      return res.sendError({message: "email required"},400);
    }
    if (!user) {
      console.log("this user does not exist in the records");
      return res.sendError({ message: "user not found!" }, 400);
    }
    if (!password){
      return res.sendError({message: "password is missing"},400);
    }
    if (!confirmPassword){
      return res.sendError({message: "confirmPassword is missing"},400)
    }
    if (password !== confirmPassword){
      return res.sendError({message: "password does not match"},400)
    }
    if (password == confirmPassword){
      // hashing the password
      const hashedPassword = await bcrypt.hash(password,15);
      console.log(hashedPassword);
      if (hashedPassword){
        user.rememberToken = null;
        await user.update({password: hashedPassword, rememberToken: null, isVerified: true})
      }
      return res.sendSuccess({message: "Password set and account Verified"})
    }

    
  } catch (error) {
    console.log(error);
    return res.sendError(
      {
        message: "Something went Wrong! Internal Server Error- createPassword",
      },
      500
    );
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
      return res.sendError({ message: "record not found!" }, 400);
    }
    if (!user.isVerified == true) {
      return res.sendError({ message: "Account Not Verified" }, 403);
    }

    if (user.password === null || user.password == "") {
      return res.sendError(
        {
          message:
            "check your mail to set the password again- request hitted before",
        },
        400
      );
    }
    await user.update({ password: null });
    console.log("Mail sent to your email address. follow the instructions");
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
    return res.sendSuccess({ message: "email sent check the email" }, 201);
  } catch (error) {
    console.log("error:", error);
    return res.sendError({ message: "internal server error" }, 500);
  }
};

const setPasswordPage = (req, res) => {
  res.end("setPasswordPage render()");
};

const setPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const email = req.params.email;
    const user = await userModel.findOne({ where: { email: email } });
    if (!user) {
      return res.sendError({ message: "user don't exist" }, 400);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await user.update({ password: hashedPassword });
    return res.sendSuccess(
      { message: "user has successfully set the password" },
      200
    );
  } catch (error) {
    console.log("error:", error);
    return res.sendError({ message: "internal server error" }, 500);
  }
};

const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({
      where: {
        email: email,
      },
    });

    // user does not exist
    if (!user) {
      return res.sendError({ message: "Invalid Email or Password!" }, 401);
    }
    // validate password
    const validatePassword = await bcrypt.compare(password, user.password);

    // incorrect password
    if (!validatePassword) {
      return res.sendError({ message: "Invalid Email or Password" }, 401);
    }

    // adding the jwt token for verification
    const token = jwt.sign(
      {
        userId: user.userId,
        username: user.firstName,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      process.env.Secret_KEY,
      { expiresIn: "60m" }
    );

    console.log("token:", token);

    return res.sendSuccess(
      {
        message: "admin login successfully!",
        token,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified,
      },
      200
    );
  } catch (error) {
    return res.sendError(
      { message: "something went wrong! Internal Server Error" },
      500
    );
  }
};

const findAllUsers = async (req, res) => {
  try {
    const { searchTerm, page, pageSize } = req.query;
    const currentPage = parseInt(page) || 1;
    const limit = parseInt(pageSize) || 10;

    let whereCondition = {};
    if (searchTerm) {
      whereCondition = {
        [Op.or]: [
          { firstName: { [Op.like]: `%${searchTerm}%` } },
          { lastName: { [Op.like]: `%${searchTerm}%` } },
          { email: { [Op.like]: `%${searchTerm}%` } },
        ],
      };
    }
    const totalRecords = await userModel.count();

    const users = await userModel.findAndCountAll({
      attributes: [
        "userID",
        "firstName",
        "lastName",
        "email",
        "isAdmin",
        "isVerified",
      ],
      where: whereCondition,
      limit,
      offset: (currentPage - 1) * limit,
    });

    if (!users || users.length === 0) {
      return res.sendError({ message: "Users not found!" }, 404);
    }
    const response = {
      totalRecords,
      currentPage,
      pageSize: limit,
      users: users.rows,
    };
    if (searchTerm) {
      response.filteredCount = Math.min(users.count, limit);
    }

    res.sendSuccess({ message: "successfully data retrieved!", response }, 200);
  } catch (error) {
    console.error("Error:", error);
    return res.sendError(
      { message: "Something went wrong! Internal server error" },
      500
    );
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
  setPassword,
  adminLogin,
  findAllUsers,
};
