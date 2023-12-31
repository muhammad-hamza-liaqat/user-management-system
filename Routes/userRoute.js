const express = require("express");
const {
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
  changePassword,
  resetRememberToken
} = require("../Controllers/userController");
const isthisUser = require("../Middleware/isUserAuth");
const isthisAdmin = require("../Middleware/isAdminAuth");
const { checkJWT, adminCheckJWT } = require("../Middleware/adminAuthJWT");
const app = express();
const userRoutes = express.Router();
const logUserActivity = require("../Middleware/activityMiddle");

userRoutes
  .route("/create-user")
  .get(getUser)
  .post(logUserActivity, adminCheckJWT, createUser); //admin can create users admin jwt check

userRoutes
  .route("/login-user")
  .get(loginPage)
  .post(logUserActivity, userLogin); // isthisUser middleware attach here
userRoutes
  .route("/create-password/:email/:token")
  .get(createPasswordPage)
  .patch(logUserActivity, createPassword);
userRoutes
  .route("/forgot-password")
  .get(forgotPasswordPage)
  .post(logUserActivity, forgotPassword);
userRoutes
  .route("/set-password/:email/:newToken")
  .get(setPasswordPage)
  .patch(logUserActivity, setPassword);

userRoutes.route("/get-users").get(checkJWT, findAllUsers); // user jwt check
userRoutes
  .route("/change-password")
  .post(checkJWT, logUserActivity, changePassword);

  
// userRoutes.route("/verify/:email/:rememberToken").get(verifyUserToken);
// userRoutes.route("/login-admin").post(isthisAdmin,adminLogin);

userRoutes.route("/reset-token").patch(logUserActivity,resetRememberToken)
module.exports = userRoutes;
