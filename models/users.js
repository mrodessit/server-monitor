var db          = require('../config/db');
var crypt       = require('../helpers/crypt');
var validator   = require('../helpers/validator');

function showAll()
{
    return db.any("select * from user_table");
}

function add(newUser)
{    
    var passHash = crypt.hashPass(newUser.password);

    return db.none("insert into user_table(username, password, isadmin) values($1, $2, $3)", [newUser.username, passHash, newUser.is_admin]);
}

function deleteUser(id)
{
    return db.none("delete from user_table where id=$1", id);
}

exports.deleteUser = deleteUser;
exports.add = add;
exports.showAll = showAll;