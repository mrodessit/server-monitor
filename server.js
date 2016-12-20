//set up tools
var express         = require('express');
var cookieParser    = require('cookie-parser');
var session         = require('express-session');
var pg              = require('pg');
var pgSession       = require('connect-pg-simple')(session);
var bodyParser      = require('body-parser');
var passport        = require('passport');
var flash           = require('connect-flash');

// set up local tools
var mainConfig      = require('./config/main');
var db              = require('./config/db');

// init express app
var app = express();

// init local strategy for passport auth
require('./config/passport')(passport);

// set template engine and template dir
app.set('view engine', 'ejs');
app.set('views', __dirname+'/views');

// init modules
app.use(cookieParser());
app.use(session({
    store: new pgSession({
        pg : pg,
        conString : mainConfig.dbConString, 
        tableName : mainConfig.sessionTable
    }),
    name: mainConfig.cookieName,
    secret: mainConfig.cookieSecret,
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));    // to support URL-encoded bodies  
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// set public dir with resources for html templates
app.use('/resource', express.static('public'));

// loading web routes 
require('./routes/routes.js')(app, passport); 

// start web app
app.listen(mainConfig.port);

console.log('Webserver started on port : '+mainConfig.port);