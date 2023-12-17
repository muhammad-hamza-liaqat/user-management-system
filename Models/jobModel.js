const { DataTypes } = require("sequelize");
const sequelize = require("../Database/connection");

const jobModel = sequelize.define("jobs", {
  applicantID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  },
  cnic: {
    type: DataTypes.STRING, // Corrected data type
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING, // Corrected data type
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("accepted", "rejected", "pending"),
    allowNull: false,
    defaultValue: "pending",
  },
  cv: {
    type: DataTypes.BLOB,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isDelete: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
}, {
  tableName: "jobs",
  timestamps: true
});

sequelize.sync()
  .then(() => {
    console.log('jobModel synchronized with the database(finalProject).');
  })
  .catch((error) => {
    console.error('Error synchronizing jobModel', error);
  });

module.exports = jobModel;
