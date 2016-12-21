
var isAuth = require('../middlewares/auth');

module.exports = function(app, passport) {

    // authentication controller
    app.use('/', require('../controllers/auth'));

    // settings controller
    app.use('/', isAuth, require('../controllers/settings'));

    // users controller
    app.use('/', isAuth, require('../controllers/users'));

    // tags controller
    app.use('/', isAuth, require('../controllers/tags'));

    // logs controller
    app.use('/', isAuth, require('../controllers/logs'));

    // servers controller
    app.use('/', isAuth, require('../controllers/servers'));

    // error page
    app.get('/error', isAuth, function(req, res) {
        var page = {
            css : "",
            breadcrump : "error",
            h1 : "Error",
            content : req.query.error,
            js : "",
            script : ""
        };

		res.render('index.ejs', page);        
	});

	app.get('/', isAuth, function(req, res) {
        var page = {
            css : "",
            breadcrump : "dashboard",
            h1 : "Dashboard",
            content : "TODO",
            js : "",
            script : ""
        };

		res.render('index.ejs', page);        
	});

};