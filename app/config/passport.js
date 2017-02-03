'use strict';

/**
 * Module dependencies.
 */
var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var user           = require('../models/user');
var crypt          = require('../helpers/crypt');

// end of dependencies.

module.exports = function() {

    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback : true 
    }, 
    function(req, username, password, done) {

        user.findByName(username, (err, userData) => {
            if (err) {
                done(err, null);
            }
            else {
                if (crypt.comparePassword(password, userData.password)) {
                    var userInfo = 
                    {
                        id : userData.id,
                        name : userData.username,
                        isAdmin : userData.isadmin
                    };

                    return done(null, userInfo);
                }
                else {
                    done("Error: password dont match.", null);
                }
            }
        });        
    }));

    // used to serialize the user
    passport.serializeUser(function(user, done) {        
		done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(userSession, done) {
        
        user.findById(userSession.id, (err, userData) => {
            if (err) {
                done(err, null);
            }
            else {
                done(null, userSession);
            }
        });
    });

};