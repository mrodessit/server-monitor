var db          = require('../config/db');

function showAll(dbHandle)
{   
    var query =  
    'select t1.id, t1.tag, t1.is_system, t1.color, t3.username '+
    'from tags_table as t1 '+
    'left join users_tags_table t2 on t1.id=t2.tag '+
    'left join user_table t3 on t3.id=t2.username ';
    
    return db.any(query);
}

function addItem(tagData)
{
    return db.one("insert into tags_table (tag, is_system, color) values($1, $2, $3) RETURNING id;", [tagData.tag, 0, tagData.color])
        .then(function(data) {

            return db.none("insert into users_tags_table (username, tag) values($1, $2)", [tagData.user_id, data.id]);
        });
}

function deleteItem(id)
{
    return db.one("select * from tags_table where id=$1", id)
        .then(function(data) {

            return new Promise(function(resolve, reject) {
                if (data.is_system)
                {
                    reject("error: system tag");
                }
                else
                {
                    resolve();
                }
            });
        })
        .then(function() {

            return db.none("delete from tags_table where id=$1", id);
        })
        .then(function() {

            return db.none("delete from server_tags_table where tag=$1", id);
        })
        .then(function() {

            return db.none("delete from users_tags_table where tag=$1", id);
        });
}

exports.deleteItem = deleteItem;
exports.addItem = addItem;
exports.showAll = showAll;