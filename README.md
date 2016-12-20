# server-monitor
Back-end. 
MVC pattern based. Using NodeJS, Express JS, PostgreSQL. Template engine - EJS.

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
