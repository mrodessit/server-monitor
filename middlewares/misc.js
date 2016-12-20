var validator    = require('../helpers/validator');

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

exports.lookGet = lookGet;