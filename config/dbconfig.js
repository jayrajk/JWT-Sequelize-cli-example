const mysql = require('mysql2');
const Sequelize = require('sequelize');
const debug = require('debug')('node-server:db');

const sequelize = new Sequelize('database_development','root','root',{
    host: '127.0.0.1',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});

sequelize
    .authenticate()
    .then( function()  {
        debug('Connection has been established successfully.');
    })
    .catch(function(err) {
        debug('Unable to connect to the database:', err);
    });

module.exports = sequelize ;