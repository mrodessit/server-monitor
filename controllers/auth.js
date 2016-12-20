var express     = require('express');
var passport    = require('passport');
var router      = express.Router();
var isAuth      = require('../middlewares/auth');

// view login form
router.get('/login', function(req, res) {
    res.render('login.ejs');
});

// process login form
router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/',
    failureRedirect : '/login',
    failureFlash : true
}));

// process logout
router.get('/logout', isAuth, function(req, res) {
    req.logout();
    res.redirect('/login');
});

module.exports = router;