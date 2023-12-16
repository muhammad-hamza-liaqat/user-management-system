const { DataTypes } = require("sequelize");
const sequelize = require("../Database/connection");

const userModel = sequelize.define(
  "users",
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "First name is required.",
        },
        len: {
          args: [3, 255],
          msg: "First name must be between 3 and 255 characters.",
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Last name is required.",
        },
        len: {
          args: [3, 255],
          msg: "Last name must be between 3 and 255 characters.",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique:true,
      validate: {
        notNull: {
          msg: "Email is required.",
        },
        isEmail: {
          msg: "Invalid email format.",
        },
        customValidator(value) {
          // Custom validation for domain and "@" sign
          if (!/@/.test(value)) {
            throw new Error("Email must contain @ symbol.");
          }

          const allowedDomains = [
            "gmail.com",
            "yahoo.com",
            "hotmail.com",
            "icloud.com",
            "outlook.com",
          ];
          const domain = value.split("@")[1];

          if (!allowedDomains.includes(domain)) {
            throw new Error("Invalid email domain!");
          }
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
      // validate: {
      //   len: {
      //     args: [6, 255],
      //     msg: "Password must be between 6 and 255 characters.",
      //   },
      //   containsSpecialCharacter(value) {
      //     // Custom validation for at least one special character
      //     if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      //       throw new Error(
      //         "Password must contain at least one special character."
      //       );
      //     }
      //   },
      // },
    },
    rememberToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    tableName: "users",
    timestamp: true,
  }
);
sequelize.sync()
    .then(() => {
        console.log('userModel synchronized with the database(finalProject).');
    })
    .catch((error) => {
        console.error('Error synchronizing userModel', error);
    });

module.exports = userModel;

