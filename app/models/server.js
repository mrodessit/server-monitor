var db = require('../config/database');

var Server = class {    

    static prepareCreate(ip) {
        var dateNow = Date.now();
        var tag = 'offline';
        var event = 'add to system';
        var query = `
        INSERT INTO server_table(ip, is_paused) VALUES('${ip}', 0);
        INSERT INTO server_state_table(server, date_create, date_update, server_state) VALUES((select id from server_table where ip='${ip}' ), ${dateNow}, ${dateNow}, '${tag}');
        INSERT INTO server_tags_table(tag, server, date_create, username_create) VALUES((select id from tags_table where tag='${tag}' ),(select id from server_table where ip='${ip}'), ${dateNow}, 0);
        INSERT INTO server_log_table(server, event, date) VALUES((select id from server_table where ip='${ip}'), '${event}', ${dateNow});`;

        return query;
    }

    static createFromArray(ipArray, callback) {
        var transaction = '';

        for (var i=0; i<ipArray.length; i++) {
            let ip =ipArray[i].replace(/\s+/g, '');

            transaction += this.prepareCreate(ip);
        }

        transaction = `BEGIN;\n${transaction}\nCOMMIT;`;

        db.exec(transaction, (err) => {
            if (err) {                
                callback("Error: while adding servers.");
            }
            else {
                callback(null, "Success: servers added.")
            }
        });
    }

    static delete(idArray, callback) {
        var transaction = '';

        for (var i=0; i<idArray.length; i++) {
            transaction += `
            DELETE FROM server_table WHERE id=${idArray[i]} ;
            DELETE FROM server_state_table WHERE server=${idArray[i]} ;
            DELETE FROM server_tags_table WHERE server=${idArray[i]} ;`;
        }

        var query = `BEGIN;\n${transaction}\nCOMMIT;`;

        db.exec(query, (err) => {            
            if (err) {         
                console.log(err);       
                callback("Error: while deleting server.");
            }
            else {
                callback(null, "Success: server deleted.")
            }
        });
    }

    static editServerTags(tagsData, userId, callback) {
        var transaction = '';
        var dateNow = Date.now();

        for(var server=0; server<tagsData.servers.length; server++) {
            for(var tag=0; tag<tagsData.tags.length; tag++) {
                if (tagsData.action == "insert") {
                    transaction += `INSERT OR IGNORE INTO server_tags_table(tag, server, date_create, username_create) VALUES((SELECT id FROM tags_table WHERE tag='${tagsData.tags[tag]}'), ${tagsData.servers[server]}, ${dateNow}, ${userId});`;
                }
                else if (tagsData.action == 'delete') {
                    transaction += `DELETE FROM server_tags_table WHERE server=${tagsData.servers[server]} AND tag=(SELECT id FROM tags_table WHERE tag='${tagsData.tags[tag]}');`;
                }                
            }            
        }

        var query = `BEGIN;\n${transaction}\nCOMMIT;`;        

        db.exec(query, (err) => {
            if (err) {                         
                callback("Error: while modife server(s) tags.");
            }
            else {
                callback(null, "Success: tags modified.");
            }
        });
    }

    static togglePauseRun(idArray, userId, callback) {
        this.findById(idArray, (err, servers) => {
            if (err) {
                callback("Error: while getting id`s.");                
            }
            else {
                var transaction = '';
                var dateNow = Date.now();

                for (var i=0; i<servers.length; i++) {
                    transaction += `UPDATE server_table SET is_paused = CASE WHEN is_paused=0 THEN 1 ELSE 0 END WHERE id=${servers[i].id};`;

                    if (!servers[i].is_paused) {
                        transaction += `INSERT OR IGNORE INTO server_tags_table(tag, server, date_create, username_create) VALUES((SELECT id FROM tags_table WHERE tag='paused'), ${servers[i].id}, ${dateNow}, ${userId});`
                    }
                    else {
                        transaction += `DELETE FROM server_tags_table WHERE server=${servers[i].id} and tag=(SELECT id FROM tags_table WHERE tag='paused');`;
                    }
                }

                var query = `BEGIN;\n${transaction}\nCOMMIT;`;

                db.exec(query, (err) => {
                    if (err) {                
                        callback("Error: while toggle pause-run.");
                    }
                    else {
                        callback(null, "Success: while toggle pause-run.");
                    }
                });
            }
        });
    }

    static findById(idArray, callback) {
        var query = `SELECT * FROM server_table `;
        var whereConditionArray = [];
        
        for (var i=0; i<idArray.length; i++) {
            whereConditionArray.push(`id=${idArray[i]}`); 
        }
        
        var whereCondition = `WHERE ${whereConditionArray.join(' OR ')} ;`;

        db.all(query+whereCondition, (err, servers) => {
            if (err) {                
                callback("Error: while getting servers info by id.");
            }
            else {
                callback(null, servers);
            }
        });
    }

    static findByIp(ipArray, callback) {
        var query = `SELECT * FROM server_table `;
        var whereConditionArray = [];
        
        for (var i=0; i<ipArray.length; i++) {
            whereConditionArray.push(`ip='${ipArray[i]}'`); 
        }
        
        var whereCondition = `WHERE ${whereConditionArray.join(' OR ')} ;`;

        db.all(query+whereCondition, (err, servers) => {
            if (err) {                
                callback("Error: while getting servers info by ip.");
            }
            else {
                callback(null, servers);
            }
        });
    }

    static list(callback) {
        var query = `
        SELECT t1.id as id, t1.ip, t1.is_paused, t2.server_state, t2.date_create, t2.date_update, group_concat(t3.tag,',') as tags_id, group_concat(t4.tag,' ') AS tags 
        FROM server_table t1
        LEFT JOIN server_state_table t2 ON t2.server=t1.id
        LEFT JOIN server_tags_table t3 ON t3.server=t1.id
        LEFT JOIN tags_table t4 ON t3.tag=t4.id
        GROUP BY t1.id, t2.server_state, t2.date_create, t2.date_update;`;

        db.all(query, (err, servers) => {
            if (err) {                
                callback("Error: while getting servers info.");
            }
            else {
                callback(null, servers);
            }
        });
    }
}

module.exports = Server;