
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

};