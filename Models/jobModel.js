const { DataTypes } = require("sequelize");
const sequelize = require("../Database/connection");
const jobModel = sequelize.define(
  "jobs",
  {
    applicantId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    userName: {
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
    qualification: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cnic: {
      type: DataTypes.NUMBER,
      allowNull: false,
      unique: true,
      validate: {
        len: [13, 13],
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [11, 11],
      },
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    },
    cv: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [21],
          msg: "Age must be greater than 20 years.",
        },
      },
    },
    isDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
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
