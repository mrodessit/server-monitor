var db = require('../config/db');

var qSessionTable = 
'CREATE TABLE "session_table" ('+
    '"sid" varchar NOT NULL COLLATE "default",'+
    '"sess" json NOT NULL,'+
	'"expire" timestamp(6) NOT NULL'+
')'+
'WITH (OIDS=FALSE);'+
'ALTER TABLE "session_table" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;';

db.none(qSessionTable)
    .then(function() {
        console.log("Session table created");
    })
    .catch(function(err) {
        console.log(err);
    })