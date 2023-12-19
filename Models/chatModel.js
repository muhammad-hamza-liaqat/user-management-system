const { DataTypes } = require("sequelize");
const sequelize = require("../Database/connection");

const chatModel = sequelize.define("chat", {
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  question: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  response: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

sequelize
  .sync()
  .then(() => {
    console.log("chatModel synchronized with the database(finalProject).");
  })
  .catch((error) => {
    console.error("Error synchronizing chatModel", error);
});

module.exports = chatModel;
