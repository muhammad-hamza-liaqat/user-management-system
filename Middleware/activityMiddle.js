const User = require("../Models/userModel");
const ActivityLog = require("../Models/activityModel");
const jwt = require("jsonwebtoken")

const logUserActivity = async (req, res, next) => {
  try {
    console.log(req.path);
    let logData = {};

    if (req.path === "/create-user" && req.method === "POST") {
      // For user creation
      const { firstName, lastName, email } = req.body;
      const userName = `${firstName} ${lastName}`;
      logData = {
        action: "User Creation",
        username: userName,
        userEmail: email,
        details: `New user ${userName} (${email}) has been created`,
      };
      console.log("log recorded for :8080/api/user/create-user");
    } else if (req.path === "/login-user" && req.method === "POST") {
      const { email } = req.body;
      // Fetch user details from the database based on the provided email
      const user = await User.findOne({ where: { email } });
      if (user) {
        const { firstName, lastName } = user;
        const userName = `${firstName} ${lastName}`;
        logData = {
          action: "User Login",
          username: userName,
          userEmail: email,
          details: `User "${email}" just logged in`,
        };
        console.log("log recorded for :8080/api/user/login-user");
      } else {
        console.log(`User with email ${email} not found`);
      }
    } else if (req.path === "/forgot-password" && req.method === "PATCH") {
      // For forget password
      const { email } = req.body;
      const user = await User.findOne({ where: { email } });
      if (user) {
        const { firstName, lastName } = user;
        const userName = `${firstName} ${lastName}`;
        logData = {
          action: "Forget Password",
          username: userName,
          userEmail: email,
          details: `Password reset request initiated for email ${email}`,
        };
        console.log("log recorded for :8080/api/user/forgot-password");
      } else {
        console.log(`User with email ${email} not found`);
      }
    } else if (req.path.startsWith("/set-password/") && req.method === "PATCH") {
      // For set password
      const { token } = req.params;
      const user = await User.findOne({ where: { rememberToken: token } });
      if (user) {
        const { firstName, lastName } = user;
        const userName = `${firstName} ${lastName}`;
        logData = {
          action: "Set Password",
          username: userName,
          userEmail: user.email,
          details: `Password reset completed with token ${token}`,
        };
        console.log("log recorded for :8080/api/user/set-password");
      }
    } else if (req.path.startsWith("/change-password") && req.method === "POST") {
      // For change password
      const token = req.headers.authorization.split(' ')[1];
      const decode = jwt.verify(token, process.env.Secret_KEY);
      const email= decode.email;
      const user = await User.findOne({ where: { email } });
      if (user) {
        const { firstName, lastName } = user;
        const userName = `${firstName} ${lastName}`;
        logData = {
          action: "Change Password",
          username: userName,
          userEmail: email,
          details: `Password Change completed with email ${email}`,
        };
        console.log("log recorded for :8080/api/user/change-password");
      }
    } else {
      // If the route doesn't match any specific path or method, proceed to next middleware
      return next();
    }

    res.on("finish", async () => {
      try {
        logData.statusCode = res.statusCode;
        if (res.statusCode >= 500 && res.statusCode <= 499) {
          logData.action = "Client Error";
          logData.details = `Client error encountered: ${res.statusMessage}`;
        } else if (res.statusCode >= 500 && res.statusCode <= 599) {
          logData.action = "Server Error";
          logData.details = `Server error encountered: ${res.statusMessage}`;
        }
        await ActivityLog.create(logData);
        console.log("user-activity-logged");
      } catch (error) {
        console.error("Error creating log:", error);
      }
    });
    
    next();
  } catch (error) {
    console.error("Error logging user activity:", error);
    next(error);
  }
};

module.exports = logUserActivity;
