// set up tools
var express     = require('express');
var passport    = require('passport');
var watcher     = require('./watcher/watcher');

// set up local tools
var db            = require('./app/config/database');
var appConfig     = require('./app/config/app');
appConfig.appPath = __dirname;

// init express app
var app = express();

// load static files
app.use(express.static(`${appConfig.appPath}/public`));

// init express modules
require('./app/config/init-modules')(app, passport);

// load web routes
require('./app/routes/routes')(app, passport);

// start web app
app.listen(appConfig.port);

console.log(`Webserver started on port : ${appConfig.port}`);

// start server state watcher
watcher.init();

module.exports = app; // for testing


