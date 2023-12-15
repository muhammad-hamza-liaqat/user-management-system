const express = require("express");
const { getUser, createUser, verifyUserToken, userLogin, createPassword, loginPage, createPasswordPage, forgotPasswordPage, forgotPassword } = require("../Controllers/userController");
const isthisUser = require("../Middleware/isUserAuth")
const app = express();
const userRoutes = express.Router();

userRoutes.route("/add-user").get(getUser).post(createUser);
userRoutes.route("/verify-user/:email/:rememberToken").get(verifyUserToken);
userRoutes.route("/login-user").get(loginPage).post(isthisUser,userLogin);
userRoutes.route("/create-password").get(createPasswordPage).post(createPassword);
userRoutes.route("/forgot-password").get(forgotPasswordPage).post(forgotPassword);

module.exports = userRoutes;
