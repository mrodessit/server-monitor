var isAuth      = require('../middlewares/authenticate');
var appConfig   = require('../config/app');

module.exports = function(app, passport) {

    // allow CORS
    app.use(function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", `http://${appConfig.host}:${appConfig.port}`);
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET");
        res.setHeader("Access-Control-Expose-Headers","Access-Control-Allow-Origin");
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,X-Prototype-Version,Content-Type,Cache-Control,Pragma,Origin");
        next();
    });

    // authenticate routes
    app.use('/', require('./authenticate'));

    // users control routes
    app.use('/api', isAuth, require('./user'));

    // tag control routes
    app.use('/api', isAuth, require('./tag'));

    // server control routes
    app.use('/api', isAuth, require('./server'));

    // log control routes
    app.use('/api', isAuth, require('./log'));

    // send static polymer index
    app.get('*', isAuth, function(req, res) {
        res.sendFile(appConfig.appPath + '/public/app.html');
    });

};