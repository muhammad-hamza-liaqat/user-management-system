const express = require("express");
const { getUser, createUser, verifyUserToken } = require("../Controllers/userController");
const app = express();
const userRoutes = express.Router();

userRoutes.route("/add-user").get(getUser).post(createUser);
userRoutes.route("/verify-user").patch(verifyUserToken);
module.exports = userRoutes;
