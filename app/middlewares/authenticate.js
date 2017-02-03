// check if user auth in system
module.exports = function (req, res, next) {
    req.isAuthenticated()
        ? next()
        : res.redirect('/login');
};