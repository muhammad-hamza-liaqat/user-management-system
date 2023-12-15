const { DataTypes } = require('sequelize');
const sequelize = require('../Database/connection'); 

const Job = sequelize.define('jobs', {
    email: {
        type: DataTypes.STRING,
    },

});
sequelize.sync()
    .then(() => {
        console.log('Job model synchronized with the database.');
    })
    .catch((error) => {
        console.error('Error synchronizing Job model:', error);
    });

module.exports = Job;
