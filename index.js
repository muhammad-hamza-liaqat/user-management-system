const express = require("express");
// const users=require('./Models/userModel');
require("dotenv").config()
const PORT = process.env.PORT;
const app = express();
// database
require("./Database/connection")
const bodyParser = require("body-parser");



// middlwares
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// adding the routes
const userRoutes = require("./Routes/userRoute");

app.use("/user", userRoutes);


// server
app.listen(PORT, ()=>{
    console.log(`server running at localhost:${PORT}/`)
});