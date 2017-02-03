var bodyParser      = require('body-parser');
var cookieParser    = require('cookie-parser');
var session         = require('express-session');
var SQLiteStore     = require('connect-sqlite3')(session);
var morgan          = require('morgan');
var appConfig       = require('./app');

module.exports = function(app, passport) { 
    require('./passport')(passport); // init local strategy for passport auth
    
    app.use(cookieParser()); // cookie initialize
    
    app.use(session({   // session initialize
        store: new SQLiteStore ({
            table: appConfig.sessionTable,        
            dir: appConfig.sessionDatabasePath
        }),
        name: appConfig.cookieName,
        secret: appConfig.cookieSecret,
        cookie: { maxAge: appConfig.cookieLifetime },
        resave: true,
        saveUninitialized: true
    }));

    app.use(bodyParser.json());       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({ extended: true }));    // to support URL-encoded bodies

    app.use(passport.initialize()); // passport initialize
    app.use(passport.session());    

    //app.use(morgan('combined')); // http logger
};