const { DataTypes } = require("sequelize");
const sequelize = require("../Database/connection");

const Chat = sequelize.define("jobs", {
  email: {
    type: DataTypes.STRING,
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
