var jsonfile = require('jsonfile');
var appConfig = require('./app');

var WatcherConfig = class {
    static get() {
        return jsonfile.readFileSync(appConfig.watcherDatabasePath);
    }

    static save(obj) {
        jsonfile.writeFileSync(appConfig.watcherDatabasePath, obj);
    }
}

module.exports = WatcherConfig;