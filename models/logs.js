var db          = require('../config/db');

function getDateRange(start, end)
{
    var query = 
    'select t1.server, t1.event, t1.date, t2.ip '+
    'from server_log_table t1 '+
    'join server_table t2 on t1.server = t2.id '+
    'where date between $1 and $2'

    return db.any(query, [start, end]);
}

function getLogsById(id)
{
    var query = 
    'select t1.server, t1.event, t1.date, t2.ip '+
    'from server_log_table t1 '+
    'join server_table t2 on t1.server = t2.id '+
    'where t1.server=$1 order by t1.date DESC';

    return db.any(query, id);
}

function getServerIdByIp(ip)
{
    return db.one("select id from server_table where ip=$1", ip);
}

exports.getServerIdByIp = getServerIdByIp;
exports.getLogsById = getLogsById;
exports.getDateRange = getDateRange;