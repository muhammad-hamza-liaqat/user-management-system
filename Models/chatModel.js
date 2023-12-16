const { DataTypes } = require("sequelize");
const sequelize = require("../Database/connection");

const Chat = sequelize.define("chats", {
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  question: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  answers: {
    type: DataTypes.STRING,
  },
  error: {
    type: DataTypes.TEXT,
  },
});

sequelize
  .sync()
  .then(() => {
    console.log("chatModel synchronized with the database(finalProject).");
  })
  .catch((error) => {
    console.error("Error synchronizing chatModel:", error);
  });

module.exports = Chat;
