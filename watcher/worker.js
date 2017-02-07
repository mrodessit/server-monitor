var async    = require('async');
var scanTool = require('./scan-server');

var portTimeout = null;

function scanServer(serverData, callback) {
    var scan = new scanTool(serverData.ip, portTimeout);

    scan.initScan((err, result) => {
        if (err) {
            callback(err);
        }
        else {            
            serverData.scanResult = result;            

            callback(null, serverData);
        }
    });
}

process.on('message', (workerOptions) => {    
    portTimeout = workerOptions.portTimeout;
    
    async.map(workerOptions.serverList, scanServer, (err, scanResult) => {
        if (err) {
            console.log(err);
        }

        process.send(workerOptions.serverList);
    });
});