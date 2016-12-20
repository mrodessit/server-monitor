var db = require('../config/db');

function getUserByName(name)
{
    return db.one("select * from user_table where username=$1", name);
}

function getUserByID(id)
{
    return db.one("select id from user_table where id=$1", id);
}

exports.getUserByName = getUserByName;
exports.getUserByID = getUserByID;