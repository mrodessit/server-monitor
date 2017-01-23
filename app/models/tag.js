var db      = require('../config/database');
var bcrypt  = require('../helpers/crypt'); 

var Tag = class {

    static create(tag, userId, callback) {        
        db.run("INSERT INTO tags_table (tag, is_system, color) VALUES (?, ?, ?)", [tag.tag, 0, tag.color], (err) => {            
            if (err) {
                callback(false, "Error: while adding new tag!");
            }
            else {
                db.run("INSERT INTO users_tags_table(username, tag) VALUES(? , (SELECT id FROM tags_table WHERE tag= ? ))", [userId, tag.tag], (err) => {
                    if (err) {
                        callback(false, "Error: while adding new tag (users_tags_table)!");
                    }
                    else {
                        callback(true, "Success: new tag added.");
                    }
                });                
            }
        });
    }

    static delete(id, callback) {
        db.run("DELETE FROM tags_table WHERE id= ? ", id, (err) => {
            if (err) {
                callback(false, "Error: while deleting tag.");
            }
            else {
                db.run("DELETE FROM server_tags_table WHERE tag= ? ", id);
                db.run("DELETE FROM users_tags_table WHERE tag= ?", id);

                callback(true, "Success: tag deleted.");
            }
        });
    }

    static update(tag, callback) {
        db.run("UPDATE tags_table SET tag= ? , color= ? WHERE id= ? ", [tag.tag, tag.color, tag.id] , (err) => {
            if (err) {
                callback(false, "Error: while updating new tag!");
            }
            else {
                callback(true, "Success: tag updated.");
            }
        });
    }

    static findById(id, callback) {
        db.get("SELECT * FROM tags_table WHERE id= ? ", id, (err, tag) => {
            if (err) {
                callback(false, "Error: while getting tag by id!");
            }
            else {
                if (tag === undefined) {
                    callback(false, "Error: no results for that id!");
                }   
                else {
                    callback(true, tag);
                }                             
            }
        });
    }

    static findByName(name, callback) {
        db.get("SELECT * FROM tags_table WHERE tag= ? ", name, (err, tag) => {
            if (err) {
                callback(false, "Error: while getting tag by name!");
            }
            else {                
                callback(true, tag);
            }
        });
    }

    static list(callback) {
        db.all("SELECT * FROM tags_table", (err, tags) => {
            if (err) {
                callback(false, "Error: while getting tag by name!");
            }
            else {
                callback(true, tags);
            }
        });
    }
}

module.exports = Tag;