const winston = require("winston");
const path = require("path");
const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../Database/connection");

// Model for Log
const LogModel = sequelize.define("Log23", {
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    allowNull: false,
  },
  level: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userAgent: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  accept: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  postmanToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  host: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  acceptEncoding: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  connection: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  statusCode: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

// Sync the model with the database
LogModel.sync();

// Custom transport for Sequelize
class SequelizeTransport extends winston.Transport {
  constructor(options) {
    super(options);
    this.name = "SequelizeTransport";
  }

  log(info, callback) {
    setImmediate(() => {
      this.emit("logged", info);
    });

    console.log("Attempting to log to Sequelize:", info);

    LogModel.create({
      timestamp: info.timestamp,
      level: info.level,
      message: info.message,
      meta: info.meta || {},
      statusCode: info.statusCode || 404,
      query: info.query,
    })
      .then((createdLog) => {
        console.log("Created Log Entry:", createdLog);
        callback(null, true);
      })
      .catch((error) => {
        console.error("Error saving log entry to Sequelize:", error);
        callback(error);
      });
  }
}

// Directory path for the log file
const logFilePath = path.join(__dirname, "..", "api.log");

// Custom transport for File
const fileTransport = new winston.transports.File({
  filename: logFilePath,
  level: "silly", // Log info level and below to the file
});

// Add an error event listener to the Sequelize transport
const sequelizeTransport = new SequelizeTransport();
sequelizeTransport.on("error", (err) => {
  console.error("Sequelize transport error:", err);
});

// Add an error event listener to the file transport
fileTransport.on("error", (err) => {
  console.error("File transport error:", err);
});

// Create a logger with both transports
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
    fileTransport,
    sequelizeTransport,
  ],
});

// Log the file path for debugging
console.log("Log file path:", logFilePath);

module.exports = { logger, LogModel };