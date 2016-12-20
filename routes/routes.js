
var isAuth = require('../middlewares/auth');

module.exports = function(app, passport) {

    // authentication controller
    app.use('/', require('../controllers/auth'));

    // settings controller
    app.use('/', isAuth, require('../controllers/settings'));

    // users controller
    app.use('/', isAuth, require('../controllers/users'));

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