var db      = require('../config/database');
var bcrypt  = require('../helpers/crypt'); 

var Tag = class {

    static create(tagData, userId, callback) {             
        db.run("INSERT INTO tags_table (tag, is_system, color) VALUES (?, ?, ?)", [tagData.tag, 0, tagData.color], (err) => {            
            if (err) {
                callback("Error: while adding new tag!");
            }
            else {
                db.run("INSERT INTO users_tags_table(username, tag) VALUES(? , (SELECT id FROM tags_table WHERE tag= ? ))", [userId, tagData.tag], (err) => {
                    if (err) {
                        callback("Error: while adding new tag (users_tags_table)!");
                    }
                    else {
                        callback(null, "Success: new tag added.");
                    }
                });                
            }
        });
    }

    static delete(id, callback) {
        db.run("DELETE FROM tags_table WHERE id= ? ", id, (err) => {
            if (err) {
                callback("Error: while deleting tag.");
            }
            else {
                db.run("DELETE FROM server_tags_table WHERE tag= ? ", id);
                db.run("DELETE FROM users_tags_table WHERE tag= ?", id);

                callback(null, "Success: tag deleted.");
            }
        });
    }

    static update(tag, callback) {
        db.run("UPDATE tags_table SET tag= ? , color= ? WHERE id= ? ", [tag.tag, tag.color, tag.id] , (err) => {
            if (err) {
                callback("Error: while updating new tag!");
            }
            else {
                callback(null, "Success: tag updated.");
            }
        });
    }

    static findById(id, callback) {
        db.get("SELECT * FROM tags_table WHERE id= ? ", id, (err, tag) => {
            if (err) {
                callback("Error: while getting tag by id!");
            }
            else {
                if (tag === undefined) {
                    callback("Error: no results for that id!");
                }   
                else {
                    callback(null, tag);
                }                             
            }
        });
    }

    static findByName(name, callback) {
        db.get("SELECT * FROM tags_table WHERE tag= ? ", name, (err, tag) => {
            if (err) {
                callback("Error: while getting tag by name!");
            }
            else {                
                callback(null, tag);
            }
        });
    }

    static list(callback) {
        db.all("SELECT * FROM tags_table", (err, tags) => {
            if (err) {
                callback("Error: while getting tag by name!");
            }
            else {
                callback(null, tags);
            }
        });
    }

    static listEditable(callback) {
        db.all("SELECT * FROM tags_table WHERE is_system=0", (err, tags) => {
            if (err) {
                callback("Error: while getting tag by name!");
            }
            else {
                callback(null, tags);
            }
        });
    }
}

module.exports = Tag;