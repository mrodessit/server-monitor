var db = require('../config/db');

function getScanDelay()
{
    return db.one("select value from config_table where name=$1", 'checkServersEverySeconds');
}

function updateServerLog(server_id, event)
{
    return db.one('select distinct on (server) server, event, date from server_log_table  where server=$1 order by server, "date" DESC', server_id)
        .then(function(data) {

            if (data.event != event)
            {
                return db.none("insert into server_log_table (server, event, date) values($1, $2, $3)", [server_id, event, Date.now()]);
            }
            else
            {
                return new Promise(function(resolve, reject) { resolve(); });
            }
        });
}

function addServerSystemTag(server_id, tag)
{
    var tag_id = null;

    return db.one("select id from tags_table where tag=$1", tag)
        .then(function(tagData) {

            tag_id = tagData.id;
            
            return new Promise(function(resolve, reject) {

                db.one("select * from server_tags_table where tag=$1 and server=$2", [tag_id, server_id])
                    .then(function(data) {
                        resolve(true);
                    })
                    .catch(function(err) {
                        resolve(false);
                    });
            });            
        })
        .then(function(res) {

            if (!res)
            {
                return db.none("insert into server_tags_table (tag, server, date_create, username_create) values($1, $2, $3, $4)", [tag_id, server_id, Date.now(), 0]);
            }
            else
            {
                return new Promise(function(resolve, reject) {
                    resolve();
                });
            }            
        });
}

function getTagId(tagArr, tag)
{
    var res = 0;

    for (var i=0; i<tagArr.length; i++)
    {
        if (tagArr[i].tag == tag)
        {
            res = tagArr[i].id;
            break; 
        }
    }

    return res;
}

function updateServerState(server_id, server_state)
{
    var tagArr;

    return db.none("update server_state_table set state=$1, date_update=$2 where server=$3", [server_state, Date.now(), server_id])
        .then(function() {

            return db.any("select id, tag from tags_table where tag=$1 or tag=$2 or tag=$3 ", ['offline', 'online', 'reply']);
        })
        .then(function(tagData) {

            tagArr = tagData;

            var qInsert = "insert into server_tags_table (tag, server, date_create, username_create) "+
                          "select $1, $2, $3, $4 where not exists (select 1 from server_tags_table where tag=$1 and server=$2)";

            switch (server_state) {
                case "online":                                                            
                    return db.none(qInsert, [getTagId(tagArr, 'online'), server_id, Date.now(), 0]);

                case "offline":
                    return db.none(qInsert, [getTagId(tagArr, 'offline'), server_id, Date.now(), 0]);                    

                case "reply":
                    return db.none(qInsert, [getTagId(tagArr, 'reply'), server_id, Date.now(), 0]);                        
            
                default:                    
                    break;
            }            
        })
        .then(function() {            
            
            switch (server_state) {
                case "online":            
                    return db.none("delete from server_tags_table where exists (select 1 from server_tags_table where tag=$1 and server=$2) and tag=$1 and server=$2", [getTagId(tagArr, 'offline'), server_id]);

                case "offline":
                    return db.none("delete from server_tags_table where exists (select 1 from server_tags_table where tag=$1 or tag=$2 and server=$3) and tag=$1 or tag=$2 and server=$3", [getTagId(tagArr, 'online'), getTagId(tagArr, 'reply'), server_id]);

                case "reply":
                    return db.none("delete from server_tags_table where exists (select 1 from server_tags_table where tag=$1 and server=$2) and tag=$1 and server=$2", [getTagId(tagArr, 'offline'), server_id]);    
            
                default:                    
                    break;
            }
        });
}

function getConfig()
{
    return db.any("select * from config_table")
        .then(function(config) {

            var serverConfig = {
                sshTimeout : null,
                rdpTimeout : null
            };

            for (var i=0; i<config.length; i++)
            {
                switch (config.name) {
                    case 'sshTimeoutSeconds':
                        serverConfig.sshTimeout = config.value * 1000;
                        break;

                    case 'rdpTimeoutSeconds':
                        serverConfig.rdpTimeout = config.value * 1000;
                        break;       
                
                    default:
                        break;
                } 
            }

            return new Promise(function(resolve, reject) {resolve(serverConfig)} );
        });
}

function getRndServers(limit)
{
    return db.any("select id, ip from server_table where is_paused=$1 order by random() limit $2", [0, limit]);
}

exports.updateServerLog = updateServerLog;
exports.addServerSystemTag = addServerSystemTag;
exports.updateServerState = updateServerState;

exports.getRndServers = getRndServers;
exports.getScanDelay = getScanDelay;
exports.getConfig = getConfig;