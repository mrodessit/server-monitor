var sqlite3     = require('sqlite3').verbose();
var appConfig   = require('./app.js')

var db = new sqlite3.Database(appConfig.mainDatabasePath);

module.exports = db;