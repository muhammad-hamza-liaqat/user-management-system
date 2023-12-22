const { DataTypes } = require("sequelize");
const sequelize = require("../Database/connection");

const LogModel = sequelize.define("mylogs", {
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
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
    userName:{
      type: DataTypes.STRING,
      allowNull: true
    },
    email:{
      type: DataTypes.STRING,
      allowNull: true
    }
});

sequelize.sync()
    .then(() => {
        console.log('userModel synchronized with the database(finalProject).');
    })
    .catch((error) => {
        console.error('Error synchronizing userModel', error);
});



module.exports = LogModel

