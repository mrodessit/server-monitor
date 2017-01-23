

module.exports = function(app, passport) {

    // allow CORS
    app.use(function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:8000");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET");
        res.setHeader("Access-Control-Expose-Headers","Access-Control-Allow-Origin");
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,X-Prototype-Version,Content-Type,Cache-Control,Pragma,Origin");
        next();
    });

    // users control routes
    app.use('/api', require('./user'));

    // tag control routes
    app.use('/api', require('./tag'));

    // server control routes
    app.use('/api', require('./server')) 

    // log control routes
    app.use('/api', require('./log'))    

    // error page
    app.get('/error', function(req, res) {
        res.sendStatus(404);
	});

};