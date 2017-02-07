var scanPing = require("net-ping");
var scanPort = require('evilscan');
var async    = require('async');

var scanTools = class {

    constructor(ip, portTimeout) {
        this.ip = ip;
        this.portTimeout = portTimeout;
        this.scanResult = {
            ping: false,
            sshState: false,
            rdpState: false,
            serverState: false,
            serverStateTag: 'offline',
            serverSystemTag: null
        };
    }

    initScan(callback) {
        async.waterfall([
            (callback) => {this.ping(callback)},
            (callback) => {this.ports(callback)},
            (callback) => {this.updateScanResultObject(callback)}
        ], (err) => {
            if (err) {
                callback(err);
            }
            else {
                callback(null, this.scanResult);
            }
        })
    }

    updateScanResultObject(callback) {
        if (this.scanResult.ping && (this.scanResult.sshState || this.scanResult.rdpState)) {
            this.scanResult.serverState = true;
            this.scanResult.serverStateTag = 'online';

            if (this.scanResult.sshState) {
                this.scanResult.serverSystemTag = 'linux';
            }
            else {
                this.scanResult.serverSystemTag = 'windows';
            }
        }

        callback(null);
    }

    ping(callback) {
        var pingSession = scanPing.createSession();

        pingSession.pingHost(this.ip, (err, target) => {
            if (err) {
                callback(null);                
            }
            else {
                this.scanResult.ping = true;
                callback(null);
            }
        });
    }

    ports(callback) {
        // scan config
        var options = {
            target: this.ip,
            port: '22,3389',
            status: 'TROU', // Timeout, Refused, Open, Unreachable
            banner: true,
            timeout : this.portTimeout
        };

        var scanner = new scanPort(options);

        scanner.on('result', (result) => {
            if (result.status == 'open') {
                if (result.port == 22) {
                    this.scanResult.sshState = true;
                }
                else if (result.port == 3389) {
                    this.scanResult.rdpState = true;
                }
            }
        });

        scanner.on('error', (err) => {
            //console.log(`Main ports scan: ${err}`);
            callback(null);
        });

        scanner.on('done', () => {
            callback(null);
        });

        scanner.run();
    }
}

module.exports = scanTools;
