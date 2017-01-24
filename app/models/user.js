var async   = require('async');
var dbUser  = require('../config/db-json');
var crypt   = require('../helpers/crypt'); 

var User = class {

    static create(user, callback) {
        async.waterfall([
            async.apply(this.validateNewUserObject, user),
            this.hashUserPassword,
            this.saveUser
        ], (err, id) => {
            if (err) {
                callback(err);
            }
            else {
                callback(null, `Success: User created. Id: ${id}.`);
            }
        });           
    }    

    static validateNewUserObject(user, callback) {
        if ("username" in user && "password" in user && "isadmin" in user) {
            if (user.username.length > 4 && user.password.length > 6 && (user.isadmin == 1 || user.isadmin == 0)) {
                callback(null, user);
            }
            else {
                callback("Error: incorrect params data.");
            }
        }
        else {
            callback("Error: missing data.");
        }        
    }

    static hashUserPassword(user, callback) {
        crypt.getStringHash(user.password, (err, hash) => {
            if (err) {
                callback(err);
            }
            else {
                user.password = hash;
                callback(null, user);
            }
        });
    }

    static saveUser(user, callback) {
        if ("id" in user && user.id != null) {
            dbUser.save(user.id, user, (err, id) => {    
                if (err) {
                callback("Error: while adding new user!");                
                }
                else {
                    callback(null, id);
                }
            });
        }
        else {
            dbUser.save(user, (err, id) => {    
                if (err) {
                callback("Error: while adding new user!");                
                }
                else {
                    callback(null, id);
                }
            });
        }
    } 

    static update(updateData, callback) {

        async.waterfall([
            async.apply(this.validateNewPasswordObject, updateData),
            this.findById,
            async.apply(this.compareNewAndUserPassword, updateData),
            this.hashUserPassword,
            this.saveUser
        ], function(err, id) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, `Success: User updated. Id: ${id}.`);
            }
        });        
    }

    static validateNewPasswordObject(newPasswordObject, callback) {
        if ("id" in newPasswordObject && "oldPassword" in newPasswordObject && "newPassword1" in newPasswordObject && "newPassword2" in newPasswordObject) {
            if (newPasswordObject.newPassword1.length > 6 && newPasswordObject.newPassword2.length > 6 && newPasswordObject.newPassword1 == newPasswordObject.newPassword2) {
                callback(null, newPasswordObject.id);
            }
            else {
                callback("Error: incorrect new password data.");
            }
        }
        else {
            callback("Error: missing data.");
        }
    }

    static compareNewAndUserPassword(newPasswordObject, user, callback) {
        crypt.compareHash(newPasswordObject.oldPassword, user.password, (err) => {
            if (err) {
                callback(err);
            }
            else {
                user.password = newPasswordObject.newPassword1;
                callback(null, user);
            }
        });
    }

    static delete(id, callback) {
        dbUser.delete(id, (err) => {
            if (err) {
                callback("Error: while deleting user by id!"); 
            }
            else {
                callback(null, "Success: user deleted!");
            }
        });
    }

    static findById(id, callback) {
        dbUser.get(id, (err, user) => {
            if (err) {
                callback("Error: while selecting user by id!"); 
            }
            else {
                callback(null, user);
            }
        });
    }

    static findByName(username, callback) {
        dbUser.all((err, users) => {
           if (err) {
               callback("Error: while selecting users!");
           } 
           else {
                var userData = null;
                
                for (let user in users) {
                    if (username == users[user].username) {
                        userData = users[user];
                        break;
                    }
                }

                callback(null, userData);
           }
        });
    }

    static list(callback) {
        dbUser.all((err, users) => {
            if (err) {                
                callback("Error: while selecting all users!");
            }
            else {
                var usersObjectArray = [];
                
                for (let user in users) {
                    usersObjectArray.push(users[user]);
                }

                callback(null, usersObjectArray);
            }
        });
    }    
}

module.exports = User;