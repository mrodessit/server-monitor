var ping = require ("net-ping");
var evilscan = require('evilscan');

function scanPing(ip)
{
    return new Promise(function(resolve, reject) {
        
        var session = ping.createSession();

        session.pingHost (ip, function (error, target) {
            if (error)
            {
                console.log(error.toString());
                resolve(false);
            }
            else
            {
                resolve(true);
            }
        });
    });
}

function checkResultScanPing(result)
{
    return new Promise(function(resolve, reject) {

        if (result) {
            resolve();                
        } else {
            reject("ping error");            
        } 
    });
}

function scanPort(server_ip, server_port, server_timeout)
{
    return new Promise(function(resolve, reject) {

        var options = {
            target: server_ip,
            port: server_port,
            status: 'TROU', // Timeout, Refused, Open, Unreachable
            banner: true,
            timeout : server_timeout
        };

        var status = false;

        var scanner = new evilscan(options);

        scanner.on('result',function(data) {
            
            if (data.status == 'open') {
                status = true;
            }
        });

        scanner.on('error',function(err) {
            resolve(false);       
        });

        scanner.on('done',function() {
            resolve(status);
        });

        scanner.run();
    });
}

function scanMainPorts(server_ip, server_timeout)
{
    return new Promise(function(resolve, reject) {

        // scan config
        var options = {
            target: server_ip,
            port: '22,3389',
            status: 'TROU', // Timeout, Refused, Open, Unreachable
            banner: true,
            timeout : server_timeout
        };
        
        // result data object
        var res = 
        {
            sshState : false,
            rdpState : false
        };

        var scanner = new evilscan(options);

        scanner.on('result',function(data) {

            if (data.status == 'open')
            {
                if (data.port == 22)
                {
                    res.sshState = true;
                }
                else if (data.port == 3389)
                {
                    res.rdpState = true;
                }                
            }
        });

        scanner.on('error',function(err) {
            resolve(res);        
        });

        scanner.on('done',function() {
            resolve(res);
        });

        scanner.run();
    });
}

exports.checkResultScanPing = checkResultScanPing;

exports.scanPing = scanPing;
exports.scanPort = scanPort;
exports.scanMainPorts = scanMainPorts;