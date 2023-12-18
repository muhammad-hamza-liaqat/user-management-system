const winston = require("winston");
const LogModel = require("../Models/logModel");

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
      userName: info.userName,
      email: info.email
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

// Custom transport for File
const sequelizeTransport = new SequelizeTransport();
sequelizeTransport.on("error", (err) => {
  console.error("Sequelize transport error:", err);
});

// Create a logger with only the Sequelize transport
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
    sequelizeTransport,
  ],
});

module.exports = { logger };
