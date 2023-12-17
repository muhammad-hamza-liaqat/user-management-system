const { DataTypes } = require("sequelize");
const sequelize = require("../Database/connection");

const LogModel = sequelize.define("logs", {
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  level: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
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

module.exports = LogModel;
