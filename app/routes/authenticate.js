var express     = require('express');
var passport    = require('passport');
var router      = express.Router();
var appConfig   = require('../config/app');
var isAuth      = require('../middlewares/authenticate');

// view login form
router.get('/login', function(req, res) {
    res.sendFile(appConfig.appPath + '/public/login.html');
});

// process login form
router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/',
    failureRedirect : '/login',
    failureFlash : false
}));

// process logout
router.get('/logout', isAuth, function(req, res) {
    req.logout();
    res.redirect('/login');
});

module.exports = router;