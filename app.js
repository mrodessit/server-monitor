// set up tools
var express         = require('express');
var pg              = require('pg');
var bodyParser      = require('body-parser');
//var cookieParser    = require('cookie-parser');
//var session         = require('express-session');
//var pgSession       = require('connect-pg-simple')(session);
//var bodyParser      = require('body-parser');
var passport        = require('passport');
//var flash           = require('connect-flash');

// set up local tools
var appConfig       = require('./app/config/app');
var db              = require('./app/config/database');

// init express app
var app = express();

// init express modules
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));    // to support URL-encoded bodies

// load static files
app.use(express.static(__dirname + '/public'));

// loading web routes for backend api
require('./app/routes/routes.js')(app, passport);

// send static polymer index
app.get('*', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

// start web app
app.listen(appConfig.port);

console.log('Webserver started on port : '+appConfig.port);

module.exports = app; // for testing


