const express = require("express");
const { getUser, createUser, verifyUserToken, userLogin, createPassword, loginPage, createPasswordPage, forgotPasswordPage, forgotPassword, setPasswordPage, setPassword, adminLogin, findAllUsers, changePassword } = require("../Controllers/userController");
const isthisUser = require("../Middleware/isUserAuth");
const isthisAdmin = require("../Middleware/isAdminAuth");
const { checkJWT, adminCheckJWT }  = require("../Middleware/adminAuthJWT")
const app = express();
const userRoutes = express.Router();
const logUserActivity = require("../Middleware/activityMiddle")



userRoutes.route("/create-user").get(getUser).post(adminCheckJWT,logUserActivity,createUser); //admin can create users admin jwt check
// userRoutes.route("/verify/:email/:rememberToken").get(verifyUserToken);
userRoutes.route("/login-user").get(loginPage).post(logUserActivity,isthisUser,userLogin);  // isthisUser middleware attach here
userRoutes.route("/create-password/:email/:token").get(createPasswordPage).patch(logUserActivity,createPassword);
userRoutes.route("/forgot-password").get(forgotPasswordPage).post(logUserActivity,forgotPassword);
userRoutes.route("/set-password/:email/:newToken").get(setPasswordPage).patch(logUserActivity,setPassword);
// userRoutes.route("/login-admin").post(isthisAdmin,adminLogin); 
userRoutes.route("/get-users").get(checkJWT,findAllUsers); // user jwt check
userRoutes.route("/change-password").post(checkJWT,changePassword);


module.exports = userRoutes;
