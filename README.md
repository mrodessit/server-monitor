# server-monitor

### Web UI
MVC pattern based. Using NodeJS, Express JS, PostgreSQL. Template engine - EJS.

Entrypoint : server.js

### Server check state tool
Module that checks server state and update information about it at DB.

Entrypoint: watcher.js

## File list Web UI

server.js - init express app

/routes/routes.js - set up site routes 

/config/* - configuration file for all system and parts. For example : passport.js needed to init local authentication strategy for that express module.

/controllers/* - controller for each site path

/helpers/* - tools that used in different parts of code

/middlewares/* - middleware functions for different controllers. Good option for express-based app architecture.

/models/* - working with DB(postgresql) for current controller need.

/public/* - list of public files, used on templates. (js, css, etc.)

/views/* - template files for EJS engine.

/setup/* - setup scripts.

## File list Watcher tool

watcher.js - init tool work

watcher/db.js - working with DB. Add, delete, edit servers state, server logs and tags.

watcher/init.js - init pre-scan options. Get scan settings, get server list to scan.

watcher/logic.js - single server scan and update info logic.

watcher/scan.js - tools for scanning.
