const express = require("express");
// const users=require('./Models/userModel');
require("dotenv").config()
const PORT = process.env.PORT;
const app = express();
// database
require("./Database/connection")
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

// express-rate-limit
const limiter = rateLimit({
  windowMs: 60 * 1000, // one minute
  max: 10, // max 10 requests
  // can hit 10 apis in one minute.
  message:
    "you have requested too many request(s), Please try again later.(RES-429)",
});



// middlwares
app.use(cors())
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

// adding the routes
const userRoutes = require("./Routes/userRoute");
const jobRoutes = require("./Routes/jobRoute");
app.use("/user", userRoutes);
app.use("/job",jobRoutes)
// middleware for 404 error page
app.use(function(req,res,next){
    res.status(404).render('404')
  });

// views setup
app.set("view engine", "ejs");
app.set("views", "./Views");


// server
app.listen(PORT, ()=>{
    console.log(`server running at localhost:${PORT}/`)
});