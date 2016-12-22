var dbHelper = require('./db');
var scan = require('./scan');

function initScanServer(watchConfig, server_ip, server_id)
{
    var serverSystem = null;
    var serverState = false;    

    scan.scanPing(server_ip) // send PING to server
        .then(function(result) {

            return scan.checkResultScanPing(result); // check PINg results
        })
        .then(function() {
            
            return scan.scanMainPorts(server_ip, watchConfig.sshTimeout); // scan ports: 22,3389
        })
        .then(function(res) {

            // check scan ports results and update server state
            if (res.sshState || res.rdpState)
            {
                serverState = true;

                if (res.sshState)
                {
                    serverSystem = "linux";
                }
                else
                {
                    serverSystem = "windows";
                }

                return dbHelper.updateServerState(server_id, "online");
            }
            else
            {                    
                return dbHelper.updateServerState(server_id, "offline");
            } 
        })
        .then(function() {

            // if system set, then add tag
            if (serverSystem != null)
            {                
                return dbHelper.addServerSystemTag(server_id, serverSystem);
            }
            else
            {
                return new Promise(function(resolve, reject) { resolve(); });
            }
        })
        .then(function() {

            // update server log if needed
            if (serverState)
            {
                return dbHelper.updateServerLog(server_id, "server online");
            }
            else
            {
                return dbHelper.updateServerLog(server_id, "server offline");
            }            
        })
        .then(function() {

            console.log("scan : Done.");
        })
        .catch(function(err) {

            if (err == "ping_error") { // catch for PING error                
                dbHelper.updateServerState(server_id, "offline");
                dbHelper.updateServerLog(server_id, "server offline");
            } else { // other errors
                console.log(err);
            }
        });
}

exports.initScanServer = initScanServer;