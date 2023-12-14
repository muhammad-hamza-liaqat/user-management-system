const express = require('express');
const { addUser } = require('../Controllers/userController');
const app = express();
const userRoutes = express.Router();

userRoutes.route('/add-user')
.get(addUser)

module.exports= userRoutes