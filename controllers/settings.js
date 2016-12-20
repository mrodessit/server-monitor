var express         = require('express');
var router          = express.Router();
var notification    = require('../helpers/notification');
var mw              = require('../middlewares/settings'); // middleware functions for settings

router.get('/settings', mw.lookGet, function(req, res) {
    
    var msg = notification.show(req.notification);

    var page = {
        css : "",
        breadcrump : "settings",
        h1 : "Settings",
        msg : notification.show(req.notification),
        js : "",
        script : ""
    };

    res.render('settings.ejs', page);
});


router.post('/settings', mw.isPostUser, mw.isPostServer, function(req, res) {
    
    res.redirect('/settings');
});

module.exports = router;