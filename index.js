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
const cron = require("node-cron");
const jwt = require("jsonwebtoken");

const cronJob = require("./cronJob/cronJob");

// winston middleware for logging
app.use(async (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  const logData = {};

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.Secret_KEY);
      logData.userName = decoded.username;
      logData.email = decoded.email;

      res.on("finish", async () => {
        logData.level = req.method;
        logData.message = req.url;
        logData.userAgent = req.headers["user-agent"];
        logData.accept = req.headers.accept;
        logData.postmanToken = req.headers["postman-token"];
        logData.host = req.headers.host;
        logData.acceptEncoding = req.headers["accept-encoding"];
        logData.connection = req.headers.connection;
        logData.statusCode = res.statusCode;

        logData.userName = logData.userName || "N/A";
        logData.email = logData.email || "N/A";

        await LogModel.create(logData);

        console.log("Final Log Data:", logData);
      });

      console.log("Decoded JWT:", decoded);
    } catch (err) {
      console.error("Error decoding token:", err);
    }
  }

  next();
});
// express-rate-limit
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // one minute
  max: 10, // max 10 requests
  message:
    "you have requested too many requests. Please try again later. (RES-429)",
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
const logRoutes = require("./Routes/logRoute");

app.use("/user", userRoutes);
app.use("/job", jobRoutes);
app.use("/chat", socketRoutes);
app.use("/log", logRoutes);

// middleware for 404 error page
app.use(function (req, res, next) {
  res.status(404).render("404");
});

// views setup
app.set("view engine", "ejs");
app.set("views", "./Views");

// server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
