var express         = require('express');
var router          = express.Router();
var modelUsers      = require('../models/users');
var notification    = require('../helpers/notification');
var mw              = require('../middlewares/users'); // middleware functions for this controller

router.get('/users-show', mw.getUserAll, function(req, res) {
    var page = {
        css : "",
        breadcrump : "show all users",
        h1 : "Show all users",
        users : req.userList,
        js : "",
        script : ""
    };

    res.render('users-show.ejs', page);
});

router.get('/users-add', mw.lookGet, function(req, res) {

    var msg = notification.show(req.notification);

    var page = {
        css : "",
        breadcrump : "show all users",
        h1 : "Show all users",
        msg : msg,
        js : "",
        script : ""
    };

    res.render('users-add.ejs', page);
});

router.post('/users-add', mw.addUser, function(req, res) {
    res.redirect('/users-add');
});

router.get('/users-edit', mw.editTodo, mw.editAction, function(req, res) {
    if (req.query.action == "delete") {
        var page = {
            css : "",
            breadcrump : "show all users",
            h1 : "Show all users",
            text : "Delete user id: "+req.query.id,
            id : req.query.id,
            js : "",
            script : ""
        };

        res.render('users-edit-delete.ejs', page);
    } else {
        res.redirect('/error?error=bad_params');
    }    
});

module.exports = router;