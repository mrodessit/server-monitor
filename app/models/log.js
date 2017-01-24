var db = require('../config/database');

var Log = class {

    static findByServerId(id, callback) {
        var query = `
        SELECT t1.server, t1.event, t1.date, t2.ip
        FROM server_log_table t1
        JOIN server_table t2 ON t1.server=t2.id
        WHERE t1.server= ? ORDER BY t1.date DESC;`;

        db.all(query, id, (err, logs) => {
            if (err) {
                callback("Error: while getting logs by ID.");
            }
            else {
                callback(null, logs);
            }
        });
    }

    static findByDateRange(start, end, callback) {
        var query = `
        select t1.server, t1.event, t1.date, t2.ip
        from server_log_table t1 
        join server_table t2 on t1.server = t2.id
        where date between ? and ? ;`;

        db.all(query, [start, end], (err, logs) => {
            if (err) {
                callback("Error: while getting logs by date range.");
            }
            else {
                callback(null, logs);
            }
        });
    }
}

module.exports = Log;