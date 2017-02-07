module.exports = 
{
    'host': "127.0.0.1",
    'port': 8000,
    'appPath': null,

    'cookieName': "monitor.sid",
    'cookieLifetime': 60 * 60 * 1000,
    'cookieSecret' : "32897423UDhsO",
    
    'mainDatabasePath' : "./app/database/main-data.db",
    'userDatabasePath' : "./app/database/user-data.json",
    'watcherDatabasePath' : "./app/database/watcher-data.json",
    'sessionDatabasePath' : "./app/database",
    'sessionTable' : "sessions"
};