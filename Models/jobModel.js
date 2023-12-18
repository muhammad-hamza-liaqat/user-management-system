const { DataTypes } = require("sequelize");
const sequelize = require("../Database/connection");

const jobModel = sequelize.define(
  "jobs",
  {
    applicantID: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    qualification: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    cnic: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    phoneNumber: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("accepted", "rejected", "pending"),
      allowNull: true,
      defaultValue: "pending",
    },
    cv: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    tableName: "jobs",
    timestamps: true,
  }
);

sequelize
  .sync()
  .then(() => {
    console.log("jobModel synchronized with the database(finalProject).");
  })
  .catch((error) => {
    console.error("Error synchronizing jobModel", error);
  });

module.exports = jobModel;
