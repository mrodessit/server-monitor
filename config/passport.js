'use strict';

/**
 * Module dependencies.
 */
var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var modelAuth      = require('../models/auth');
var crypt          = require('../helpers/crypt');

// end of dependencies.

module.exports = function() {

    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback : true 
    }, 
    function(req, username, password, done) {
        
        modelAuth.getUserByName(username)        
            .then(function(user) {
                
                if (crypt.comparePass(password, user.password)) {
                    var userInfo = 
                    {
                        id : user.id,
                        name : user.username,
                        isAdmin : user.isadmin
                    };

                    return done(null, userInfo);
                } else {
                    return done(null, null, req.flash('loginMessage', 'Wrong password.'));
                }
            })
            .catch(function(err) {
                return done(err, null, req.flash('loginMessage', 'No user found.'));
            });  
    }));

    // used to serialize the user
    passport.serializeUser(function(user, done) {        
		done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
        
        modelAuth.getUserByID(user.id)
            .then(function(user) {
                done(null, user);
            })
            .catch(function(err) {
                done(err, null);
            });
    });

};