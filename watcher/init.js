var dbHelper = require('./db');
var scan = require('./scan');
var logic = require('./logic');

function init()
{    
    var watchConfig = 
    { 
        serverWatchLimit : 250,        
        sshTimeout : null,
        rdpTimeout : null
    };    

    dbHelper.getConfig() // get config for scan logic
        .then(function(config) {

            watchConfig.sshTimeout = config.sshTimeout;
            watchConfig.rdpTimeout = config.rdpTimeout;

            return dbHelper.getRndServers(watchConfig.serverWatchLimit); // get random servers to scan
        })
        .then(function(servers) {
            
            for (var i=0; i<servers.length; i++)
            {
                logic.initScanServer(watchConfig, servers[i].ip, servers[i].id); // start scan
            }

        })
        .catch(function(err) {
            console.log(err); // error msg
        });
}

function start()
{
    var checkDelay = 60000; //default

    require('events').EventEmitter.defaultMaxListeners = Infinity;

    //init();

    // get scan delay
    dbwHelper.getScanDelay(dbHandle)
        .then(function(config) {
            checkDelay = config.value * 1000;
            
            // init scan server interval
            var timer = setInterval(function(){
                init(dbHandle);
            }, checkDelay);
        })
        .catch(function(err) {
            console.log(err);
        });    
        
}

exports.init = init;
exports.start = start;