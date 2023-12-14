const express = require('express');
const { getUser, createUser } = require('../Controllers/userController');
const app = express();
const userRoutes = express.Router();

userRoutes.route('/add-user')
.get(getUser)
.post(createUser)

module.exports= userRoutes