const express = require("express");
require("dotenv").config()
const PORT = process.env.PORT;
const app = express();
// database
require("./Database/connection")

// adding the routes
const userRoutes = require("./Routes/userRoute");
app.use("/user", userRoutes);


// middlwares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// server
app.listen(PORT, ()=>{
    console.log(`server running at localhost:${PORT}/`)
});