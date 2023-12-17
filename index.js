const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT;
const http = require("http");
const socketIO = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const standardizeResponse = require("./Middleware/responseFormat");
// database
require("./Database/connection");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const { logger } = require("./Services/winston");
const LogModel = require("./Models/logModel");

// express-rate-limit
const limiter = rateLimit({
  // windowMs: 60 * 60 * 1000, // one hour
  windowMs: 1 * 60 * 1000, // one minute
  max: 10, // max 10 requests
  // can hit 10 apis in one minute.
  message:
    "you have requested too many request(s), Please try again later.(RES-429)",
});

// middlwares
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);
app.use(standardizeResponse);

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle chat events here
  socket.on("chat message", (msg) => {
    console.log(`Message: ${msg}`);
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// adding the routes
const userRoutes = require("./Routes/userRoute");
const jobRoutes = require("./Routes/jobRoute");
const socketRoutes = require("./Routes/socketRoute");

app.use("/user", userRoutes);
app.use("/job", jobRoutes);
app.use("/chat", socketRoutes);
// middleware for 404 error page
app.use(function (req, res, next) {
  res.status(404).render("404");
});

// winston
app.use((req, res, next) => {
  var logData = {};
  res.on("finish", async () => {
    logData = {
      level: req.method,
      message: req.url,
      userAgent: req.headers["user-agent"],
      accept: req.headers.accept,
      postmanToken: req.headers["postman-token"],
      host: req.headers.host,
      acceptEncoding: req.headers["accept-encoding"],
      connection: req.headers.connection,
      statusCode: res.statusCode,
    };
    LogModel.create(logData).then(() => {
      console.log(logData);
    });
  });
  console.log(logData);
  next();

  // .catch((error) => {
  //   console.error("Error saving log entry to Sequelize:", error);
  //   next();
  // });
});

// views setup
app.set("view engine", "ejs");
app.set("views", "./Views");

// server
app.listen(PORT, () => {
  console.log(`server running at localhost:${PORT}/`);
});
