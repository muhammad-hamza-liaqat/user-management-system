const express = require("express");
const { getUser, createUser, verifyUserToken, userLogin, setPassword } = require("../Controllers/userController");
const isthisUser = require("../Middleware/isUserAuth")
const app = express();
const userRoutes = express.Router();

userRoutes.route("/add-user").get(getUser).post(createUser);
userRoutes.route("/verify-user/:email/:rememberToken").get(verifyUserToken);
userRoutes.route("/login-user").post(isthisUser,userLogin);
userRoutes.route("/set-password").post(setPassword);

module.exports = userRoutes;
