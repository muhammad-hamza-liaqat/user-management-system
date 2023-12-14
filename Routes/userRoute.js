const express = require("express");
const { getUser, createUser, verifyUserToken, userLogin } = require("../Controllers/userController");
const app = express();
const userRoutes = express.Router();

userRoutes.route("/add-user").get(getUser).post(createUser);
userRoutes.route("/verify-user").patch(verifyUserToken);
userRoutes.route("/login-user").post(userLogin);
module.exports = userRoutes;
