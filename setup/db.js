var db = require('../config/db');
var crypt = require('../helpers/crypt');

var dbAdmin_name = 'admin';
var dbAdmin_pass = 'admin';
var dbAdmin_passHash = crypt.hashPass(dbAdmin_pass);

var qSessionTable = 
'CREATE TABLE IF NOT EXISTS "session_table" ('+
    '"sid" varchar NOT NULL COLLATE "default",'+
    '"sess" json NOT NULL,'+
	'"expire" timestamp(6) NOT NULL'+
')'+
'WITH (OIDS=FALSE);'+
'ALTER TABLE "session_table" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;';

db.none(qSessionTable)
    .then(function() {
        console.log("Query: Session table created");
    })
    .catch(function(err) {
        console.log(err);
    })

// user_table
var qUserTable = 
        'CREATE TABLE IF NOT EXISTS user_table (' +
        'id SERIAL PRIMARY KEY,' +
        'username varchar(128) UNIQUE NOT NULL,' +
        'password varchar(128) NOT NULL,' +
        'isadmin smallint NOT NULL DEFAULT 0)';  

db.none(qUserTable)
    .then(function() {
        console.log("Query : user_table created");

        db.none("insert into user_table (username, password, isadmin) values($1, $2, $3)", [dbAdmin_name, dbAdmin_passHash, 1])
            .then(function() {
                console.log("User admin added!");
            })
            .catch(function(err) {
                console.log("Error while adding admin!");
            });
    })
    .catch(function(error) {
        console.log("Query 2: "+error);
});     

var qServerTable = 
    'CREATE TABLE IF NOT EXISTS server_table (' +
    'id SERIAL PRIMARY KEY, '+
    "ip varchar(64) NOT NULL DEFAULT '0.0.0.0', "+
    "comments text NOT NULL DEFAULT '', "+
    'is_paused smallint NOT NULL DEFAULT 0)';

db.none(qServerTable)
    .then(function() {
        console.log("Query server_table!");
    })
    .catch(function(error) {
        console.log("Query 3: "+error);
});

var qTagsTable =
    'CREATE TABLE IF NOT EXISTS tags_table (' +
    'id SERIAL PRIMARY KEY, '+
    "tag varchar(64) UNIQUE NOT NULL DEFAULT '', "+
    'is_system smallint NOT NULL DEFAULT 0, '+
    'color varchar(6) NULL)';

db.none(qTagsTable)
    .then(function() {
        return db.none("insert into tags_table(tag, is_system, color) values($1, $2, $3)", ['offline', 1, 'A0A0A0']);
    })
    .then(function() {
        return db.none("insert into tags_table(tag, is_system, color) values($1, $2, $3)", ['online', 1, 'FF9933']);
    })
    .then(function() {
        return db.none("insert into tags_table(tag, is_system, color) values($1, $2, $3)", ['reply', 1, '009900']);
    })
    .then(function() {
        return db.none("insert into tags_table(tag, is_system, color) values($1, $2, $3)", ['paused', 1, 'D0D0D0']);
    })
    .then(function() {
        return db.none("insert into tags_table(tag, is_system, color) values($1, $2, $3)", ['windows', 1, null]);
    })
    .then(function() {
        return db.none("insert into tags_table(tag, is_system, color) values($1, $2, $3)", ['linux', 1, null]);
    })
    .catch(function(err) {
        console.log(err);
});

var qTagsServerTable = 
    'CREATE TABLE IF NOT EXISTS server_tags_table (' +
    'tag BIGINT NOT NULL DEFAULT 0, '+
    'server BIGINT NOT NULL DEFAULT 0, '+
    'date_create BIGINT NOT NULL, '+
    'username_create BIGINT NOT NULL DEFAULT 0, '+        
    'PRIMARY KEY (tag, server) )';

db.none(qTagsServerTable)
    .then(function() {
        console.log("Query : server_tags_table created!");
    })
    .catch(function(error) {
        console.log("Query 5: "+error);
});

var EnumServerState = "CREATE TYPE server_state AS ENUM ('offline', 'online', 'reply');";
var qServerStateTable = 
    'CREATE TABLE IF NOT EXISTS server_state_table (' +
    'server BIGINT NOT NULL, '+
    'date_create BIGINT NOT NULL, '+
    'date_update BIGINT NOT NULL, '+
    "state server_state NOT NULL DEFAULT 'offline', "+        
    'PRIMARY KEY(server))';

db.none(EnumServerState)
    .then(function() {
        console.log("Query : create enum");        
    })
    .catch(function(error) {
        console.log("Query enum: "+error);
    });

db.none(qServerStateTable)
    .then(function() {
        console.log("Query : server_state_table created");        
    })
    .catch(function(error) {
        console.log("Query 6: "+error);
}); 


var qServerLogTable = 
    'CREATE TABLE IF NOT EXISTS server_log_table (' +          
    'server BIGINT NOT NULL, '+
    "event varchar(64) NOT NULL DEFAULT '', "+
    'date BIGINT NOT NULL DEFAULT 0 );';

db.none(qServerLogTable)
    .then(function() {
        console.log("Query : server_log_table done");        
    })
    .catch(function(error) {
        console.log("Query log table: "+error);
}); 

var qUsersTagsTable = 
    'CREATE TABLE IF NOT EXISTS users_tags_table (' +
    'username BIGINT NOT NULL DEFAULT 0, '+
    'tag BIGINT NOT NULL DEFAULT 0, '+        
    'PRIMARY KEY (username, tag) );';

db.none(qUsersTagsTable)
    .then(function() {
        console.log("Query : users_tags_table done!");
    })
    .catch(function(error) {
        console.log("Query 7: "+error);
});

var qConfigTable = 
    'CREATE TABLE IF NOT EXISTS config_table (' +
    "name varchar(64) UNIQUE NOT NULL DEFAULT '', "+
    "value INT NOT NULL DEFAULT 0 )";

db.none(qConfigTable)
    .then(function() {
        console.log("Query : config_table created!");

        return db.none("insert into config_table(name, value) values($1, $2)", ['sshTimeoutSeconds', 20]);
    })
    .then(function() {

        return db.none("insert into config_table(name, value) values($1, $2)", ['rdpTimeoutSeconds', 20]);
    })
    .then(function() {
        
        return db.none("insert into config_table(name, value) values($1, $2)", ['checkServersEverySeconds', 600]);
    })
    .catch(function(error) {
        console.log("Query 8: "+error);
}); 