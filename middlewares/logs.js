
var modelLogs   = require('../models/logs');
var dateHelper  = require('../helpers/date');
var validator   = require('../helpers/validator');

var setLastDayRange = function(req, res, next) {
    
    var start = new Date();
    start.setHours(0,0,0,0);

    var end = new Date();
    end.setHours(23,59,59,999);

    start = start.getTime();
    end = end.getTime();

    req.logStart = start;
    req.logEnd = end;

    next();
}

var setLastMonthRange = function(req, res, next) {
    
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth()+1, 0);

    firstDay = firstDay.getTime();
    lastDay = lastDay.getTime();

    req.logStart = firstDay;
    req.logEnd = lastDay;

    next();
}

var setLastYearRange = function(req, res, next) {

    var date = new Date();
    var firstDay = new Date(new Date().getFullYear(), 0, 31)
    var lastDay = new Date(new Date().getFullYear(), 11, 31)

    firstDay = firstDay.getTime();
    lastDay = lastDay.getTime();

    req.logStart = firstDay;
    req.logEnd = lastDay;

    next();
}

var checkId = function(req, res, next) {
    
    if (validator.isEmpty(req.query.id))
    {
        res.redirect('/error?error=restricted.no_server_id');
    }
    else
    {
        next();
    }
}

function FormatLogsData(logs)
{
    var bgcolor = {};
    bgcolor['add to system'] = 'e3fcff';
    bgcolor['server offline'] = 'ffeae3';
    bgcolor['server online'] = 'e3ffe7';

    for (var i=0; i<logs.length; i++)
    {
        logs[i].bgColor = bgcolor[logs[i].event];
        logs[i].dateStr = dateHelper.getShortDateString(new Date(parseInt(logs[i].date, 10)));        
    }

    return logs;
}

var getLogsByRange = function(req, res, next) {

    modelLogs.getDateRange(req.logStart, req.logEnd)
        .then(function(logs) {            

            req.logList = FormatLogsData(logs);

            next();
        })
        .catch(function(err) {
            res.redirect('/error?error='+err);
        });
}

var getLogsById = function(req, res, next) {
    
    modelLogs.getLogsById(req.query.id)
        .then(function(logs) {
            
            req.logList = FormatLogsData(logs);

            next();
        })
        .catch(function(err) {
            res.redirect('/error?error='+err);
        });
}

var getLogsByIp = function(req, res, next) {

    var notification = { type : "", text : ""};
    req.notification = notification;

    if (validator.isEmpty(req.query.ip))
    {
        next();
    }
    else
    {
        modelLogs.getServerIdByIp(req.query.ip)
            .then(function(server) {
                res.redirect('/logs-server?id='+server.id);
            })
            .catch(function(err) {
                req.notification = { type : "error", text : err };
                next();
            })
    }
}

exports.getLogsByIp = getLogsByIp;
exports.checkId = checkId;
exports.setLastDayRange = setLastDayRange;
exports.setLastMonthRange = setLastMonthRange;
exports.setLastYearRange = setLastYearRange;
exports.getLogsByRange = getLogsByRange;
exports.getLogsById = getLogsById;