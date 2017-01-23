var dbUser = require('../config/db-json');
var bcrypt = require('../helpers/crypt'); 

var User = class {    

    static create(user, callback) {

        this.validateUserObject(user, (result) => {
            if (result) {                
                user.password = bcrypt.hashPassword(user.password);

                dbUser.save(user, (err, id) => {
                    if (err) {
                        callback(false, "Error: while adding new user!"); 
                    }
                    else {
                        callback(true, "Success: User created. Id: "+id+".");
                    }
                });
            }
            else {
                callback(false, "Error: data incorrect!");
            }
        });                
    }

    static update(updateData, callback) {
        
        this.validateNewPasswordObject(updateData, (result, user) => {
            if (result) {                                
                user.password = bcrypt.hashPassword(updateData.newPassword1);

                dbUser.save(user.id, user, (err, id) => {
                    if (!err) {
                        callback(true, "Success: User update. Id: "+id+".");
                    }
                    else {
                        callback(false, "Error: while updating !");            
                    }
                });
            }
            else {
                callback(false, "Error: data incorrect!");
            }
        });
    }

    static delete(id, callback) {
        dbUser.delete(id, (err) => {
            if (err) {
                callback(false, "Error: while deleting user by id!"); 
            }
            else {
                callback(true, "Success: user deleted!");
            }
        });
    }

    static findById(id, callback) {
        dbUser.get(id, (err, user) => {
            if (err) {
                callback(false, "Error: while selecting user by id!"); 
            }
            else {
                callback(true, user);
            }
        });
    }

    static findByName(username, callback) {
        dbUser.all((err, users) => {
           if (err) {
               callback(false, "Error: while selecting users!");
           } 
           else {
                var userData = null;
                
                for (let user in users) {
                    if (username == users[user].username) {
                        userData = users[user];
                        break;
                    }
                }

                callback(true, userData);
           }
        });
    }

    static list(callback) {
        dbUser.all((err, users) => {
            if (err) {                
                callback(false, "Error: while selecting all users!");
            }
            else {
                var usersObjectArray = [];
                
                for (let user in users) {
                    usersObjectArray.push(users[user]);
                }

                callback(true, usersObjectArray);
            }
        });
    }    

    static validateUserObject(user, callback) {
        var checkNewUserData = false;

        if ("username" in user && user.username.length > 4) {
            if ("password" in user && user.password.length > 6 ) {
                if ("isadmin" in user && (user.isadmin == 1 || user.isadmin == 0)) {
                    checkNewUserData = true;
                }
            }
        }

        callback(checkNewUserData);
    }

    static validateNewPasswordObject(password, callback) {
        var checkNewPasswordObject = false;

        if ("id" in password && "oldPassword" in password) {
            if ("newPassword1" in password && "newPassword1" in password) {
                if (password.newPassword1.length > 6 && password.newPassword2.length > 6 && password.newPassword1 == password.newPassword2) {
                    checkNewPasswordObject = true;
                }
            }
        }

        if (checkNewPasswordObject) {
            this.compareUserIdPassword(password.id, password.oldPassword, (result, user) => {                
                callback(result, user);
            });
        }
        else {
            callback(checkNewPasswordObject);
        }        
    }

    static compareUserIdPassword(id, password, callback) {
        dbUser.get(id, (err, user) => {
            if (err) {
                callback(false);
            }
            else {                
                if (bcrypt.comparePassword(password, user.password)) {
                    callback(true, user);
                }
                else {
                    callback(false);
                }
            }
        });
    }
}

module.exports = User;