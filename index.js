const express = require("express");
require("dotenv").config()
const PORT = process.env.PORT;
const app = express();
// database
require("./Database/connection")

// middlwares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// server
app.listen(PORT, ()=>{
    console.log(`server running at localhost:${PORT}/`)
});