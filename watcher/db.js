var async   = require('async');
var db      = require('../app/config/database');

var dbTools = class {
    static updateServerStateDetails(serverId, serverState, callback) {
        async.waterfall([
            async.apply(dbHelper.updateServerState, serverId, serverState),
            dbHelper.getServerStateTagsInfo,
            async.apply(dbHelper.insertServerStateTag, serverId, serverState),
            async.apply(dbHelper.deleteServerStateTag, serverId, serverState == 'online' ? 'offline' : 'online')
        ], (err) => {
            if (err) {                
                callback(err);
            }
            else {
                callback(null);
            }
        });
    }

    static addServerSystemTag(serverId, tagName, callback) {
        if (tagName != null) {
            async.waterfall([
                async.apply(dbHelper.selectTagByName, tagName),
                async.apply(dbHelper.selectServerTag, serverId),
                dbHelper.insertServerTag
            ], (err) => {
                if (err) {                    
                    callback(err);
                }
                else {
                    callback(null);
                }
            });
        } 
        else {
            callback(null);
        }       
    }

    static selectRandomServers(limit, callback) {
        db.all("SELECT id, ip FROM server_table WHERE is_paused= ? ORDER BY random() LIMIT ?", [0, limit], (err, servers) => {
            if (err) {
                callback(err);
            }
            else {
                callback(null, servers);
            }
        });
    }

    static updateServerLog(id, event, callback) {
        db.all("SELECT DISTINCT server, event, date FROM server_log_table WHERE server=? ORDER BY server, date DESC", id, (err, log) => {
            if (err) {
                callback(err);
            }
            else if (log.event == event) {
                callback(null);
            }
            else {
                db.run("INSERT INTO server_log_table(server, event, date) VALUES(?, ?, ?)", [id, event, Date.now()], (err) => {
                    if (err) {
                        callback(err);
                    }
                    else {
                        callback(null);
                    }
                });
            }
        });
    }
}

var dbHelper = class {
    static updateServerState(serverId, serverState, callback) {
        db.run("UPDATE server_state_table SET server_state=?, date_update=? WHERE server=?", [serverState, Date.now(), serverId], (err) => {
            if (err) {           
                console.log(err);     
                callback(err);
            }
            else {
                callback(null);
            }
        });
    }

    static getServerStateTagsInfo(callback) {
        db.all("SELECT id, tag FROM tags_table WHERE tag=? OR tag=? OR tag=?", ['online', 'offline', 'reply'], (err, tagsData) => {
            if (err) {
                callback(err);
            }
            else {
                callback(null, tagsData);
            }
        })
    }

    static getTagId(tagsData, tagName) {
        var resultId = 0;

        for (var i=0; i<tagsData.length; i++) {
            if (tagsData[i].tag == tagName) {
                resultId = tagsData[i].id;
                break; 
            }
        }

        return resultId;
    }

    static insertServerStateTag(serverId, serverState, tagsData, callback) {
        var query = `
        INSERT INTO server_tags_table(tag, server, date_create, username_create) 
        SELECT ${dbHelper.getTagId(tagsData, serverState)}, ${serverId}, ${Date.now()}, 0
        WHERE NOT EXISTS(SELECT 1 FROM server_tags_table WHERE tag = ${dbHelper.getTagId(tagsData, serverState)} AND server = ${serverId});`;

        db.run(query, (err) => {
            if (err) {
                callback(err);
            }
            else {
                callback(null, tagsData);
            }
        });
    }

    static deleteServerStateTag(serverId, serverState, tagsData, callback) {
        var query = `
        DELETE FROM server_tags_table 
        WHERE EXISTS (SELECT 1 FROM server_tags_table WHERE tag=${dbHelper.getTagId(tagsData, serverState)} AND server=${serverId}) 
        AND tag=${dbHelper.getTagId(tagsData, serverState)} AND server=${serverId}`;

        db.run(query, (err) => {
            if (err) {
                callback(err);
            }
            else {
                callback(null);
            }
        });
    }

    static selectTagByName(tagName, callback) {
        db.get("SELECT * FROM tags_table WHERE tag=?", tagName, (err, tag) => {
            if (err) {
                callback(err);
            }
            else {
                callback(null, tag);
            }
        });
    }

    static selectServerTag(serverId, tagData, callback) {
        db.get("SELECT * FROM server_tags_table WHERE tag=? AND server=?", [tagData.id, serverId], (err, result) => {
            if (err) {
                callback(err);
            }
            else {
                if (result === undefined) {
                    var insertServerTagData = {
                        serverId: serverId,
                        tagId: tagData.id                        
                    }                    

                    callback(null, insertServerTagData);
                }
                else {                    
                    callback(null, null);
                }
            }
        });
    } 

    static insertServerTag(serverTagData, callback) {        
        if (serverTagData) {
            db.run("INSERT INTO server_tags_table(tag, server, date_create, username_create) VALUES(?, ?, ?, ?)", [serverTagData.tagId, serverTagData.serverId, Date.now(), 0], (err) => {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null);
                }
            });
        }      
        else {
            callback(null);
        }  
    }
}

module.exports = dbTools;