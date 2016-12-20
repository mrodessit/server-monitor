
var modelUsers   = require('../models/users');
var validator    = require('../helpers/validator');

var getUserAll = function(req, res, next) {

    var user_access = {};
    user_access[1] = '<span class="label label-success">admin</span>';
    user_access[0] = '<span class="label label-info">user</span>';

    modelUsers.showAll()
        .then(function(users) {

            for (var i=0; i<users.length; i++)
            {
                var button_delete = '<a href="/users-edit?action=delete&id='+users[i].id+'" class="btn btn-danger btn-mini">Delete</a>';

                users[i].isadmin = user_access[users[i].isadmin];
                users[i].delete = button_delete;
            }

            req.userList = users;

            next();
        })
        .catch(function(err) {
            console.log(err);
            res.redirect('/error?error='+err);
        });            
}

var addUser = function(req, res, next) {
    var newUser = {
        username : req.body.username,
        password : req.body.password,
        is_admin : 0
    }

    if (!validator.isEmpty(req.body.isadmin))
    {
        newUser.is_admin = 1;
    }

    if (validator.isEmpty(newUser.username) || validator.isEmpty(newUser.password))
    {
        res.redirect('/users-add?status=error&error=empty_fields');
    }
    else
    {
        modelUsers.add(newUser)
            .then(function() {
                res.redirect('/users-add?status=success');
            })
            .catch(function(err) {
                res.redirect('/users-add?status=error&error='+err);
            });
    }        
}

var lookGet = function(req, res, next) {
    
    var notification = { type : "", text : ""};

    if (req.query.status) {        
        if (req.query.status == 'success') {
            
            notification = {
                type : "success",
                text : "User succesfully added!"
            };
        } else if (req.query.status == 'error') {
            
            notification = {
                type : "error",
                text : req.query.error
            };
        }
    }

    req.notification = notification;

    next();
}

var editTodo = function(req, res, next) {

    if (!validator.isEmpty(req.query.id))
    {    
        if (!validator.isEmpty(req.query.todo)) {

            modelUsers.deleteUser(req.query.id)
                .then(function() {
                    res.redirect('/users-show');
                })
                .catch(function(err){
                    res.redirect('/error?error='+err);
                });
        } 
        else {
            next();
        }
    } 
    else {
        next();
    }
}

var editAction = function(req, res, next) {
    
    if (!validator.isEmpty(req.query.action) && req.query.action == "delete") {        
        next();
    }
    else {
        res.redirect('/error?error=bad_action');
    }
}

exports.editAction = editAction;
exports.editTodo = editTodo;
exports.lookGet = lookGet;
exports.addUser = addUser;
exports.getUserAll = getUserAll;