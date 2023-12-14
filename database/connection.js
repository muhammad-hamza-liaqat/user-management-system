const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('projectFinal', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
})

sequelize.authenticate().then(() => {
    console.log('connected to projectFinal Database');
 }).catch((error) => {
    console.error('something went wrong, DB not connected!');
 });


module.exports = sequelize