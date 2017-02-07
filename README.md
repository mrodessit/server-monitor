# server-monitor

### BACKEND
MVC pattern based. Using NodeJS, ExpressJS. User data stored in JSON file. Server data, logs and tags stored in SQLite file. Sessions in separate SQL file.

### FRONTEND
Build using Polymer with help of native polymer webcomponents. Shadow DOM support. 

### Server check state tool
Module that checks server state and update information about it at DB. 

## Structure
/app - backend 
/public - polymer frontend
/setup - setup database files
/test - testing backend with MOCHA & CHAI. 
/watcher - server state check tool

Entrypoint: app.js