module.exports = 
{
//    'DEBUG': true,
    'host': "127.0.0.1",
    'port': 8000,
    'appPath': null,

    'cookieName': "monitor.sid",
    'cookieLifetime': 60 * 60 * 1000,
    'cookieSecret' : "32897423UDhsO",
//    'sessionTable' : "session_table",
//    'session_lifetime': 60 * 60 * 1000,
//    'session_clean': 30 * 60 * 1000,
    
    'mainDatabasePath' : "./app/database/main-data.db",
    'userDatabasePath' : "./app/database/user-data.json",
    'sessionDatabasePath' : "./app/database",
    'sessionTable' : "sessions"
};