const { DataTypes } = require("sequelize");
const sequelize = require("../Database/connection");

const activityModel = sequelize.define('activities', {
    logId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    action: {
        type: DataTypes.STRING
    },
    username: {
        type: DataTypes.STRING
    },
    userEmail: {
        type: DataTypes.STRING
    },
    details: {
        type: DataTypes.STRING
    },
}, {
    timestamps: true,
});
module.exports = activityModel