var async = require('async');
var db    = require('../config/database');

var serverTableColumns = ['id', 'id', 'ip', 'is_paused', 'server_state', 'date_create', 'date_update', 'tags'];

var ServerDataTable = class {

    constructor(query) {
        this.draw = null;        
        this.columns = null;
        this.order = null;
        this.start = null;
        this.length = null;
        this.search = null;

        if ("draw" in query) this.draw = query.draw;
        if ("columns" in query) this.columns = query.columns;
        if ("order" in query) this.order = query.order;
        if ("start" in query) this.start = query.start;
        if ("length" in query) this.length = query.length;
        if ("search" in query) this.search = this.prepareSearchPattern(query.search);

        this.servers = null;
        this.tags = null;
        this.rowsTotal = 0;
        this.rowsFiltered = 0;
        this.limit = "";
        this.orderBy = "";
    }

    finalize(callback) {
        async.waterfall([            
            (callback) => {this.tableCount(callback)},
            (callback) => {this.tableLimit(callback)},
            (callback) => {this.tableOrder(callback)},
            (callback) => {this.tableList(callback)},
            (callback) => {this.applyFilter(callback)},
            (callback) => {this.tagList(callback)},
            (callback) => {this.updateList(callback)}
        ], (err, data) => {
            if (err) {
                callback(err);
            }
            else {
                var dataTable = {
                    draw: this.draw,
                    recordsTotal: this.rowsTotal,
                    recordsFiltered: this.rowsFiltered,
                    data: data
                }

                callback(null, dataTable);
            }                
        });
    }

    tableCount(callback) {
        var query = `SELECT COUNT(*) AS rows FROM server_table`;
        
        db.all(query, (err, count) => {
            if (err) {
                callback("Error: while counting servers.");
            }
            else {                
                this.rowsTotal = count[0].rows;
                this.rowsFiltered = count[0].rows;
                callback(null);
            }
        });
    }

    tableLimit(callback) {
        this.limit = `LIMIT ${this.start}, ${this.length} `;
        callback(null);
    }

    tableOrder(callback) {
        var orderByArray = [];

        for (var i=0; i<this.order.length; i++) {
            orderByArray.push(`${serverTableColumns[this.order[i].column]} ${this.order[i].dir.toUpperCase()}`);
        }

        this.orderBy = `ORDER BY ${orderByArray.join(',')}`;
        callback(null);
    }

    tableList(callback) {        
        var query = `
        SELECT t1.id as id, t1.ip AS ip, t1.is_paused AS is_paused, t2.server_state AS server_state, 
        t2.date_create AS date_create, t2.date_update AS date_update, group_concat(t4.tag,' ') AS tags 
        FROM server_table t1
        LEFT JOIN server_state_table t2 ON t2.server=t1.id
        LEFT JOIN server_tags_table t3 ON t3.server=t1.id
        LEFT JOIN tags_table t4 ON t3.tag=t4.id
        GROUP BY t1.id, t2.server_state, t2.date_create, t2.date_update
        ${this.orderBy}
        ${this.limit}`;

        db.all(query, (err, servers) => {
            if (err) {                            
                callback("Error: while getting servers info.");
            }
            else {
                this.servers = servers;
                callback(null);
            }
        });
    }

    prepareSearchPattern(search) {
        var conditionArray = search.value.split(' ').filter(String); 
        var conditionRegex = [];

        for (var i=0; i<conditionArray.length; i++) {
            if (conditionArray[i].substring(0,1) != '!') {
                conditionRegex.push(`(?=.*${conditionArray[i]})`);
            }
            else {
                conditionRegex.push(`(?!.*${conditionArray[i].replace('!','')})`);
            }            
        }
        search.regexpPattern = `^${conditionRegex.join('')}.*$`;

        return search;
    }

    applyFilter(callback) {        
        if (this.search.value.length) {            
            var serversFiltered = [];
            var countFiltered = 0;

            for(var i=0; i<this.servers.length; i++) {                
                var rowString = '';

                for (var key in this.servers[i]) {
                    rowString += this.servers[i][key];
                }

                var regExpSearch = new RegExp(this.search.regexpPattern);

                if (regExpSearch.test(rowString)) {
                    serversFiltered.push(this.servers[i]);                    
                }
                else {
                    countFiltered++;
                }
            }            

            this.servers = serversFiltered;
            this.rowsFiltered = this.rowsFiltered - countFiltered;            
        }   

        callback(null);     
    }

    tagList(callback) {
        var query = `SELECT * FROM tags_table;`;

        db.all(query, (err, tags) => {
            if (err) {
                callback("Error: while getting tags.");
            }
            else {                
                this.tags = tags;
                callback(null);
            }
        });
    }

    generateTagElement(tagName, tags) {
        var element = '';                

        if (tags) {
            for (var i=0; i<tags.length; i++) {
                if (tags[i].tag == tagName) {
                    element = `<span style="color:#${tags[i].color};">${tags[i].tag}</span>`;
                }
            }
        }

        return element;
    }

    generateTagString(tagString) {
        var tagArray = tagString.split(' ');
        var result = [];

        for (var i=0; i<tagArray.length; i++) {
            result.push(this.generateTagElement(tagArray[i], this.tags));
        }

        return result.join(' ');
    }    

    generateShortDateTimeString(timestamp) {
        var date = new Date(timestamp);
        var dateOptions = { year: '2-digit', month: '2-digit', day: '2-digit'};
        var timeOptions = { hour12: false, hour: '2-digit', minute: '2-digit'};

        return date.toLocaleDateString([], dateOptions)+', '+date.toLocaleTimeString([], timeOptions);
    }

    updateList(callback) {
        var servers = this.servers;                        

        for(var i=0; i<servers.length; i++) {            
            servers[i].ip = `<span class="mdl-row-ip" id="${servers[i].id}-ip">${servers[i].ip}</span>`;
            servers[i].is_paused = servers[i].is_paused ? true : false;
            servers[i].date_create = this.generateShortDateTimeString(servers[i].date_create);
            servers[i].date_update = this.generateShortDateTimeString(servers[i].date_update);
            servers[i].tags = this.generateTagString(servers[i].tags);
            servers[i].checkbox = `<input type="checkbox" name="serverCheckBox[]" value="${servers[i].id}">`;                        
            servers[i].buttons = `
            <button id="buttonCopyId${servers[i].id}" onClick="_serverCopyIp(event)">Copy</button> 
            <a href="server-edit-tags?id=${servers[i].id}"><button>Tags</button></a>
            <button id="buttonPauseRun${servers[i].id}" onClick="_serverPauseRun(event,${servers[i].id})">Pause/Run</button>
            <a href="logs-by-id?id=${servers[i].id}"><button>Logs</button></a>
            <a href="server-delete?id=${servers[i].id}"><button>Delete</button></a>`;
        }

        callback(null, servers);
    }
}

module.exports = ServerDataTable;