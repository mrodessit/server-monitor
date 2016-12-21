var db          = require('../config/db');
var validator   = require('../helpers/validator');

function addItems(serverArr, callback)
{
    return db.tx(function(t) {
        var queries = [];

        var now = Date.now();

        for(var i=0; i<serverArr.length; i++)
        {
            var server_ip =serverArr[i].replace(/\s+/g, '');
            queries.push(t.none("insert into server_table(ip, is_paused) values($1, $2)", [server_ip, 0]));
            queries.push(t.none("insert into server_state_table(server, date_create, date_update, state) values((select id from server_table where ip=$1), $2, $3, $4)", [server_ip, now, now, 'offline']));
            queries.push(t.none("insert into server_tags_table(tag, server, date_create, username_create) values((select id from tags_table where tag=$1),(select id from server_table where ip=$2), $3, $4)", ['offline', server_ip, Date.now(), 0]));
            queries.push(t.none("insert into server_log_table(server, event, date) values((select id from server_table where ip=$1), $2, $3)", [server_ip, "add to system", Date.now()]));
        }

        return t.batch(queries);
    })
    .then(function() {
        callback("success", "server_added")
    })
    .catch(function(err) {            
        console.log(err);
        callback("error", "error_data_type.data_rollback");
    });
}

function showItems()
{
    var serversInfo = 
    {
        tags : null,
        servers : null
    };

    var query = 
    "select t1.id as id, t1.ip, t1.is_paused, t2.state, t2.date_create, t2.date_update, string_agg(t3.tag::character varying,',' order by t3.tag) as tags_id, string_agg(t4.tag::character varying,' ' order by t4.id) AS tags "+
    "from server_table t1 "+
    "left join server_state_table t2 on t2.server=t1.id "+
    "left join server_tags_table t3 on t3.server=t1.id "+
    "left join tags_table t4 on t3.tag=t4.id "+
    "GROUP BY t1.id, t2.state, t2.date_create, t2.date_update ";

    return db.any("select * from tags_table")
        .then(function(tags) {
            
            serversInfo.tags = tags;

            return db.any(query);
        })
        .then(function(data) {

            serversInfo.servers = data;

            return new Promise(function(resolve, reject) {
                
                resolve(serversInfo);
            });    
        });
}

function serverPauseRun(id, user_id)
{
    var is_paused;

    return db.one("select is_paused from server_table where id=$1", id)
        .then(function(server) {
                        
            if (server.is_paused) is_paused = 0;
            else is_paused = 1;

            return db.none("update server_table set is_paused=$1 where id=$2", [is_paused, id]);
        })
        .then(function() {

            if (is_paused)
            {
                return db.none("insert into server_tags_table(tag, server, date_create, username_create) values((select id from tags_table where tag=$1), $2, $3, $4)", ['paused', id, Date.now(), user_id]);
            }
            else
            {
                return db.none("delete from server_tags_table where server=$1 and tag=(select id from tags_table where tag=$2)", [id, 'paused']);
            }
        });
}

function serverArrPauseRun(idArr, callback)
{
    return db.tx(function(t) {        
        var queries = [];

        idArr = idArr.split(',');

        for(var i=0; i<idArr.length; i++)
        {
            queries.push(t.one("update server_table set is_paused = CASE WHEN is_paused=$1 THEN $2 ELSE $3 END where id=$4 RETURNING id, is_paused", [0, 1, 0, idArr[i]]));          
        }

        return t.batch(queries);
        })
    .then(function(data) {
        //console.log(data);

        return db.tx(function(t) {
            var queries = [];

            for (var i=0; i<data.length; i++)
            {
                if (data[i].is_paused)
                {
                    queries.push(t.none("insert into server_tags_table(tag, server, date_create, username_create) values((select id from tags_table where tag=$1), $2, $3, $4)", ['paused', data[i].id, Date.now(), 0]));
                }
                else
                {
                    queries.push(t.none("delete from server_tags_table where server=$1 and tag=(select id from tags_table where tag=$2)", [data[i].id, 'paused']));
                }
            }

            return t.batch(queries);
        });       
    })
    .then(function() {
        
        callback("success");
    })
    .catch(function(err) {            
        console.log(err);
        callback("error");
    });
}

function serverDelete(id)
{
    return db.none("delete from server_table where id=$1", id)
            .then(function() {

                return db.none("delete from server_state_table where server=$1", id);
            })
            .then(function() {

                return db.none("delete from server_tags_table where server=$1", id);
            });
}

function serverArrDelete(idArr, callback)
{
    return db.tx(function(t) {        
        var queries = [];

        idArr = idArr.split(',');

        for(var i=0; i<idArr.length; i++)
        {
            queries.push(t.none("delete from server_table where id=$1", idArr[i]));
            queries.push(t.none("delete from server_state_table where server=$1", idArr[i]));
            queries.push(t.none("delete from server_tags_table where server=$1", idArr[i]));            
        }

        return t.batch(queries);
        })
        .then(function() {
            callback("success")
        })
        .catch(function(err) {            
            console.log(err);
            callback("error");
        });
}

function getAllTags()
{
    var query =
    "select t1.id, t1.tag, t1.is_system, t1.color, string_agg(t2.server::character varying,',' order by t2.server) as server "+
    'from tags_table t1 '+
    'left join server_tags_table t2 on t2.tag=t1.id '+
    'where t1.is_system=$1 '+
    'GROUP BY 1, 2, 3, 4';

    return db.any(query, 0);
}

function serverArrAddTags(idArr, tags, user_id)
{
    var tagsArr = tags.split(' ');

    return db.any("select id, tag from tags_table where is_system=$1", 0)
        .then(function(tagsTable) {

            return new Promise(function(resolve, reject) {

                return db.tx(function(t) {

                    var queries = [];
                    var now = Date.now();

                    idArr = idArr.split(',');

                    for (var server=0; server<idArr.length; server++)
                    {
                        for (var i=0; i<tagsArr.length; i++)
                        {
                            var tag_id = null;

                            for (var j=0; j<tagsTable.length; j++)
                            {
                                if (tagsTable[j].tag == tagsArr[i]) tag_id = tagsTable[j].id;
                            }

                            if (tag_id != null)
                            {
                                queries.push(this.none("insert into server_tags_table(tag, server, date_create, username_create) values($1, $2, $3, $4)", [tag_id, idArr[server], now, user_id]));
                            }
                        }
                    }                    

                    return this.batch(queries);
                })
                .then(function() {
                    resolve();
                })
                .catch(function(err) {
                    reject(err);
                });
            });
        });
}

function serverAddTags(server_id, tags, user_id)
{
    var tagsArr = tags.split(' ');

    return db.any("select id, tag from tags_table where is_system=$1", 0)
        .then(function(tagsTable) {

            return new Promise(function(resolve, reject) {

                return db.tx(function(t) {

                    var queries = [];
                    var now = Date.now();

                    for (var i=0; i<tagsArr.length; i++)
                    {
                        var tag_id = null;

                        for (var j=0; j<tagsTable.length; j++)
                        {
                            if (tagsTable[j].tag == tagsArr[i]) tag_id = tagsTable[j].id;
                        }

                        if (tag_id != null)
                        {
                            queries.push(this.none("insert into server_tags_table(tag, server, date_create, username_create) values($1, $2, $3, $4)", [tag_id, server_id, now, user_id]));
                        }
                    }

                    return this.batch(queries);
                })
                .then(function() {
                    resolve();
                })
                .catch(function(err) {
                    reject(err);
                });
            });
        });
}

function serverDeleteTags(server_id, tags)
{
    var tagsArr = tags.split(' ');

    return db.any("select id, tag from tags_table where is_system=$1", 0)
        .then(function(tagsTable) {

            return new Promise(function(resolve, reject) {

                return db.tx(function(t) {

                    var queries = [];
                    var now = Date.now();

                    for (var i=0; i<tagsArr.length; i++)
                    {
                        var tag_id = null;

                        for (var j=0; j<tagsTable.length; j++)
                        {
                            if (tagsTable[j].tag == tagsArr[i]) tag_id = tagsTable[j].id;
                        }

                        if (tag_id != null)
                        {
                            queries.push(this.none("delete from server_tags_table where server=$1 and tag=$2", [server_id, tag_id]));
                        }
                    }

                    return this.batch(queries);
                })
                .then(function() {
                    resolve();
                })
                .catch(function(err) {
                    reject(err);
                });
            });
        });
}

function serverArrDeleteTags(serversArr, tags)
{
    var tagsArr = tags.split(' ');

    return db.any("select id, tag from tags_table where is_system=$1", 0)
        .then(function(tagsTable) {

            return new Promise(function(resolve, reject) {

                return db.tx(function(t) {

                    var queries = [];
                    var now = Date.now();

                    serversArr = serversArr.split(',');

                    for (var server=0; server<serversArr.length; server++)
                    {
                        for (var i=0; i<tagsArr.length; i++)
                        {
                            var tag_id = null;

                            for (var j=0; j<tagsTable.length; j++)
                            {
                                if (tagsTable[j].tag == tagsArr[i]) tag_id = tagsTable[j].id;
                            }

                            if (tag_id != null)
                            {
                                queries.push(this.none("delete from server_tags_table where server=$1 and tag=$2", [serversArr[server], tag_id]));
                            }
                        }
                    }                    

                    return this.batch(queries);
                })
                .then(function() {
                    resolve();
                })
                .catch(function(err) {
                    reject(err);
                });
            });
        });
}

exports.serverArrDeleteTags = serverArrDeleteTags;
exports.serverDeleteTags = serverDeleteTags;
exports.serverAddTags = serverAddTags;
exports.serverArrAddTags = serverArrAddTags;
exports.getAllTags = getAllTags;

exports.serverArrDelete = serverArrDelete;
exports.serverDelete = serverDelete;

exports.serverArrPauseRun = serverArrPauseRun;
exports.serverPauseRun = serverPauseRun;

exports.addItems = addItems;
exports.showItems = showItems;