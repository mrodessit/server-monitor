var jsonStore   = require('jfs');
var sqlite3     = require('sqlite3').verbose();
var fs          = require('fs');
var bcrypt      = require('../app/helpers/crypt');

// create user json table 

var dbUser = new jsonStore('../app/database/user-data.json', {saveId: "id", pretty:true});

var userAdmin = {
    username : "admin",
    password : bcrypt.hashPassword("admin"),
    isadmin : 1
}

dbUser.save(userAdmin, (err) => {
    if (err) {
        console.log(err);
    }
});

// create sqlite3 database

var dbFile = '../app/database/main-data.db';
var dbExists = fs.existsSync(dbFile);
 
// If the database doesn't exist, create a new file:
if(!dbExists)
{
    fs.openSync(dbFile, 'w');
}
 
// Initialize the database:
var db = new sqlite3.Database(dbFile);

var qServerTable = 
    'CREATE TABLE IF NOT EXISTS server_table (' +
    'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, '+
    "ip TEXT NOT NULL DEFAULT '0.0.0.0', "+
    "comments TEXT NOT NULL DEFAULT '', "+
    'is_paused INTEGER NOT NULL DEFAULT 0)';

db.run(qServerTable);

var qTagsTable =
    'CREATE TABLE IF NOT EXISTS tags_table (' +
    'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, '+
    "tag TEXT UNIQUE NOT NULL DEFAULT '', "+
    'is_system INTEGER NOT NULL DEFAULT 0, '+
    'color TEXT NULL)';

db.run(qTagsTable, (err) => {
    if (!err) {
        db.run("INSERT OR IGNORE INTO tags_table (tag, is_system, color) VALUES (?, ?, ?)", ['offline', 1, 'A0A0A0']);
        db.run("INSERT OR IGNORE INTO tags_table (tag, is_system, color) VALUES (?, ?, ?)", ['online', 1, 'FF9933']);
        db.run("INSERT OR IGNORE INTO tags_table (tag, is_system, color) VALUES (?, ?, ?)", ['reply', 1, '009900']);
        db.run("INSERT OR IGNORE INTO tags_table (tag, is_system, color) VALUES (?, ?, ?)", ['paused', 1, 'D0D0D0']);
        db.run("INSERT OR IGNORE INTO tags_table (tag, is_system, color) VALUES (?, ?, ?)", ['windows', 1, null]);
        db.run("INSERT OR IGNORE INTO tags_table (tag, is_system, color) VALUES (?, ?, ?)", ['linux', 1, null]);
    }
});    

var qServerTagsTable = 
    'CREATE TABLE IF NOT EXISTS server_tags_table (' +
    'tag INTEGER NOT NULL DEFAULT 0, '+
    'server INTEGER NOT NULL DEFAULT 0, '+
    'date_create INTEGER NOT NULL, '+
    'username_create INTEGER NOT NULL DEFAULT 0, '+        
    'PRIMARY KEY (tag, server) )';

db.run(qServerTagsTable);

var qServerStateTable = 
    'CREATE TABLE IF NOT EXISTS server_state_table (' +
    'server INTEGER NOT NULL, '+
    'date_create INTEGER NOT NULL, '+
    'date_update INTEGER NOT NULL, '+
    "server_state TEXT NOT NULL DEFAULT 'offline', "+        
    'PRIMARY KEY(server))';    

db.run(qServerStateTable);

var qServerLogTable = 
    'CREATE TABLE IF NOT EXISTS server_log_table (' +          
    'server INTEGER NOT NULL, '+
    "event TEXT NOT NULL DEFAULT '', "+
    'date INTEGER NOT NULL DEFAULT 0 );';   

db.run(qServerLogTable);

var qUsersTagsTable = 
    'CREATE TABLE IF NOT EXISTS users_tags_table (' +
    'username INTEGER NOT NULL DEFAULT 0, '+
    'tag INTEGER NOT NULL DEFAULT 0, '+        
    'PRIMARY KEY (username, tag) );';

db.run(qUsersTagsTable);    