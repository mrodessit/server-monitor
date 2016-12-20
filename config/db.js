var pgp         = require('pg-promise')();
var mainConfig  = require('./main.js')

var dbConfig = {
    host: mainConfig.dbHost,  
    port: mainConfig.dbPort,
    database: mainConfig.dbDatabase,
    user: mainConfig.dbUser,
    password: mainConfig.dbPassword
};

var db = pgp(dbConfig);

module.exports = db;