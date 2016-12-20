module.exports = 
{
    'DEBUG': true,
    'host': "127.0.0.1",
    'port': 8000,

    'cookieName': "monitor.sid",
    'cookie_lifetime': 60 * 60 * 1000,
    'cookieSecret' : "32897423UDhsO",
    'sessionTable' : "session_table",
    'session_lifetime': 60 * 60 * 1000,
    'session_clean': 30 * 60 * 1000,
    
    'dbConString' : "postgres://test_user:qwerty@localhost:5432/smonitor",
    'dbHost' : "localhost",
    'dbPort' : 5432,
    'dbDatabase' : "smonitor",
    'dbUser' : "test_user",
    'dbPassword' : "qwerty"
};