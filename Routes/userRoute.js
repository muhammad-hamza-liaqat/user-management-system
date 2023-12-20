const express = require("express");
const { getUser, createUser, verifyUserToken, userLogin, createPassword, loginPage, createPasswordPage, forgotPasswordPage, forgotPassword, setPasswordPage, setPassword, adminLogin, findAllUsers } = require("../Controllers/userController");
const isthisUser = require("../Middleware/isUserAuth");
const isthisAdmin = require("../Middleware/isAdminAuth");
const { checkJWT, adminCheckJWT }  = require("../Middleware/adminAuthJWT")
const app = express();
const userRoutes = express.Router();

userRoutes.route("/create-user").get(getUser).post(adminCheckJWT,createUser);
userRoutes.route("/verify/:email/:rememberToken").get(verifyUserToken);
userRoutes.route("/login-user").get(loginPage).post(isthisUser,userLogin); 
userRoutes.route("/create-password").get(createPasswordPage).patch(createPassword);
userRoutes.route("/forgot-password").get(forgotPasswordPage).post(forgotPassword);
userRoutes.route("/set-password/:email").get(setPasswordPage).patch(setPassword);
// userRoutes.route("/login-admin").post(isthisAdmin,adminLogin); 
userRoutes.route("/get-users").get(checkJWT,findAllUsers);

module.exports = userRoutes;
