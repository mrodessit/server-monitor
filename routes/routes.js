
var isAuth = require('../middlewares/auth');

module.exports = function(app, passport) {

    // authentication controller
    app.use('/', require('../controllers/auth'));

    // settings controller
    app.use('/', isAuth, require('../controllers/settings'));

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
/*
	app.get('/login', function(req, res) {
		res.render('login.ejs');
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/',
		failureRedirect : '/login',
		failureFlash : true
	}));

	app.get('/logout', isAuth, function(req, res) {
		req.logout();
		res.redirect('/login');
	});
*/    
};