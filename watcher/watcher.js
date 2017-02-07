var cp       = require('child_process');
var async    = require('async');
var dbTools  = require('./db');
var watcherConfig = require('../app/config/db-settings');

var watcher = class {
    static start() {
        async.waterfall([
            async.apply(dbTools.selectRandomServers, watcherConfig.get().scanServerLimit),
            (servers, callback) => { this.prepareWorkerTaskArray(servers, callback) },
            (taskArray, callback) => { this.createWorkers(taskArray, callback) }
        ], (err) => {
            if (err) {
                console.log(err);
            }

            this.setTimer();
        });        
    }

    static setTimer() {        
        setTimeout(() => {
            this.start();
        }, watcherConfig.get().watcherStartDelay * 1000);
    }

    static prepareWorkerTaskArray(servers, callback){        
        var taskArray = [];
        var taskCountPerWorker = servers.length / watcherConfig.get().scanWorkerCount;
        
        for (var i=0; i<servers.length; i+=taskCountPerWorker) {
            taskArray.push(servers.slice(i,i+taskCountPerWorker));
        }

        callback(null, taskArray);
    }

    static createWorkers(taskArray, callback) {
        async.map(
        taskArray, 
        (serverList, callback) => { this.runWorker(serverList, callback) }, 
        (err) => {
            if (err) {
                callback(err);
            }
            else {
                callback(null);
            }
        });
    }

    static runWorker(serverList, callback) {
        if (serverList.length) {
            var worker = cp.fork(`${__dirname}/worker.js`);

            var workerOptions = {
                portTimeout: watcherConfig.get().scanPortTimeout * 1000,
                serverList: serverList
            };

            worker.send(workerOptions);

            worker.on('message', (serverListAfterScan) => {
                worker.kill();           

                async.map(
                serverListAfterScan, 
                (server, callback) => { this.updateServerData(server, callback) }, 
                (err) => {
                    if (err) {
                        callback(err);
                    }
                    else {
                        callback(null);
                    }
                });
            });
        } 
        else {
            callback(null);
        }       
    }

    static updateServerData(server, callback) {
        var serverLogEvent = `server ${server.scanResult.serverStateTag}`;

        async.waterfall([
            async.apply(dbTools.updateServerStateDetails, server.id, server.scanResult.serverStateTag),
            async.apply(dbTools.addServerSystemTag, server.id, server.scanResult.serverSystemTag),
            async.apply(dbTools.updateServerLog, server.id, serverLogEvent)
        ], (err) => {
            if (err) {
                callback(err);
            }
            else {
                callback(null);
            }
        });
    }
}

module.exports = { 

    init: function() {        
        require('events').EventEmitter.defaultMaxListeners = Infinity;

        setTimeout(() => {
            watcher.start();
        }, watcherConfig.get().watcherStartDelay * 1000);   
    }
}