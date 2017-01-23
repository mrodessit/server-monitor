var jsonStore   = require('jfs');
var appConfig   = require('./app.js')

var dbUser = new jsonStore(appConfig.userDatabasePath, {saveId: "id", pretty:true});

module.exports = dbUser;