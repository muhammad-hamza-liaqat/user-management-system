const express = require("express");
const { getUser, createUser, verifyUserToken, userLogin } = require("../Controllers/userController");
const isthisUser = require("../Middleware/isUserAuth")
const app = express();
const userRoutes = express.Router();

userRoutes.route("/add-user").get(getUser).post(createUser);
userRoutes.route("/verify-user").patch(verifyUserToken);
userRoutes.route("/login-user").post(isthisUser,userLogin);

module.exports = userRoutes;
