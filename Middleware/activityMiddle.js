const User = require("../Models/userModel");
const ActivityLog = require("../Models/activityModel")

const logUserActivity = async (req, res, next) => {
  try {
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
      console.log("User Creation log action detected");
    } else if (req.path === "/login-user" && req.method === "POST") {
      // For user login
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
          details: `User "${email}" jsut logged in`,
        };
        console.log("User Login log action detected");
      } else {
        console.log(`User with email ${email} not found`);
      }
    } else if (req.path === "/forgot-password" && req.method === "POST") {
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
        console.log("Forget Password log action detected");
      } else {
        console.log(`User with email ${email} not found`);
      }
    } else if (
      req.path.startsWith("/set-password/") &&
      req.method === "PATCH"
    ) {
      // For set password
      const { token } = req.params;
      logData = {
        action: "Set Password",
        details: `Password reset completed with token ${token}`,
      };
      console.log("Set Password log action detected");
    } else if (
      req.path.startsWith("/create-password") &&
      req.method === "PATCH"
    ) {
      // For set password
      const { token } = req.params;
      logData = {
        action: "Set Password",
        details: `Password reset completed with token ${token}`,
      };
      console.log("Set Password log action detected");
    } else {
      // If the route doesn't match any specific path or method, proceed to next middleware
      return next();
    }
    res.on("finish", async () => {
      try {
        logData.statusCode = res.statusCode;
        if (res.statusCode >= 400 && res.statusCode <= 499) {
          logData.action = "Client Error";
          logData.details = `Client error encountered: ${res.statusMessage}`;
        } else if (res.statusCode >= 500 && res.statusCode <= 599) {
          logData.action = "Server Error";
          logData.details = `Server error encountered: ${res.statusMessage}`;
        }
        await ActivityLog.create(logData);
        console.log("User activity logged successfully:"); // Check the logged createdLog object
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
