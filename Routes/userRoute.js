const express = require("express");
const { getUser, createUser, verifyUserToken, userLogin, createPassword, loginPage, createPasswordPage, forgotPasswordPage, forgotPassword, setPasswordPage, setPassword, adminLogin } = require("../Controllers/userController");
const isthisUser = require("../Middleware/isUserAuth")
const isthisAdmin = require("../Middleware/isAdminAuth")
const app = express();
const userRoutes = express.Router();

userRoutes.route("/add-user").get(getUser).post(createUser);
userRoutes.route("/verify-user/:email/:rememberToken").get(verifyUserToken);
userRoutes.route("/login-user").get(loginPage).post(isthisUser,userLogin); // middleware added to login only user accounts
userRoutes.route("/create-password").get(createPasswordPage).post(createPassword);
userRoutes.route("/forgot-password").get(forgotPasswordPage).post(forgotPassword);
userRoutes.route("/set-password/:email").get(setPasswordPage).post(setPassword);
userRoutes.route("/admin-login").post(isthisAdmin,adminLogin); // middleware added for the admin users only

module.exports = userRoutes;
