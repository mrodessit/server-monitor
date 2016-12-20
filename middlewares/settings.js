
var modelSettings   = require('../models/settings');

var lookGet = function(req, res, next) {
    
    var notification = { type : "", text : ""};

    if (req.query.action) {        
        if (req.query.action == 'success') {
            
            notification = {
                type : "success",
                text : "Info succesfully added!"
            };
        } else if (req.query.action == 'error') {
            
            notification = {
                type : "error",
                text : req.query.error
            };
        }
    }

    req.notification = notification;

    next();
}

var isPostUser = function(req, res, next) {

    if (req.body.action && req.body.action == "user")
    {
        var passData = {
            old  : req.body['old-pass'],
            new1 : req.body['new-pass1'],
            new2 : req.body['new-pass2']
        }

        modelSettings.changePassword(passData, req.session.passport.user.id)
            .then(function() {
                res.redirect("/settings?action=success");
            })
            .catch(function(err) {
                res.redirect("/settings?action=error&error="+err);
            }); 
    }
    else
    {
        next();
    }
}

var isPostServer = function(req, res, next) {
    
    if (req.body.action && req.body.action == "server")
    {
        var serverData = {
            ssh : req.body.ssh,
            rdp : req.body.rdp,
            check : req.body.check
        }

        modelSettings.changeServerConfig(serverData)
            .then(function() {
                res.redirect("settings?action=success");
            })
            .catch(function(err)
            {
                res.redirect("settings?action=error&error="+err);
            });
    }
    else
    {
        next();
    }
}

exports.isPostServer = isPostServer;
exports.isPostUser = isPostUser;
exports.lookGet = lookGet;