var express         = require('express');
var router          = express.Router();
var notification    = require('../helpers/notification');
var mw              = require('../middlewares/logs'); // middleware functions for this controller

router.get('/logs-by-ip', mw.getLogsByIp, function(req, res) {
    
    var msg = notification.show(req.notification);
    
    var page = {
        css : "",
        breadcrump : "logs by ip",
        h1 : "Logs by ip",
        msg : msg,
        js : "",
        script : ""
    };

    res.render('logs-by-ip.ejs', page);
});

router.get('/logs-server', mw.checkId, mw.getLogsById, function(req, res) {

    var custom_css = '<link rel="stylesheet" href="resource/css/uniform.css" /><link rel="stylesheet" href="resource/css/select2.css" />';
    var custom_js = '<script src="resource/js/jquery.uniform.js"></script><script src="resource/js/select2.min.js"></script><script src="resource/js/jquery.dataTables.min.js"></script><script src="resource/js/matrix.tables.js"></script>'; 
    
    var page = {
        css : custom_css,
        breadcrump : "show server logs",
        h1 : "Show server logs",
        logs : req.logList,
        js : custom_js,
        script : ""
    };

    res.render('logs-show.ejs', page);
});

router.get('/logs-day', mw.setLastDayRange, mw.getLogsByRange, function(req, res) {
    
    var custom_css = '<link rel="stylesheet" href="resource/css/uniform.css" /><link rel="stylesheet" href="resource/css/select2.css" />';
    var custom_js = '<script src="resource/js/jquery.uniform.js"></script><script src="resource/js/select2.min.js"></script><script src="resource/js/jquery.dataTables.min.js"></script><script src="resource/js/matrix.tables.js"></script>'; 
    
    var page = {
        css : custom_css,
        breadcrump : "show daily logs",
        h1 : "Show daily logs",
        logs : req.logList,
        js : custom_js,
        script : ""
    };

    res.render('logs-show.ejs', page);
});

router.get('/logs-month', mw.setLastMonthRange, mw.getLogsByRange, function(req, res) {
    
    var custom_css = '<link rel="stylesheet" href="resource/css/uniform.css" /><link rel="stylesheet" href="resource/css/select2.css" />';
    var custom_js = '<script src="resource/js/jquery.uniform.js"></script><script src="resource/js/select2.min.js"></script><script src="resource/js/jquery.dataTables.min.js"></script><script src="resource/js/matrix.tables.js"></script>'; 
    
    var page = {
        css : custom_css,
        breadcrump : "show monthly logs",
        h1 : "Show monthly logs",
        logs : req.logList,
        js : custom_js,
        script : ""
    };

    res.render('logs-show.ejs', page);
});

router.get('/logs-year', mw.setLastYearRange, mw.getLogsByRange, function(req, res) {
    
    var custom_css = '<link rel="stylesheet" href="resource/css/uniform.css" /><link rel="stylesheet" href="resource/css/select2.css" />';
    var custom_js = '<script src="resource/js/jquery.uniform.js"></script><script src="resource/js/select2.min.js"></script><script src="resource/js/jquery.dataTables.min.js"></script><script src="resource/js/matrix.tables.js"></script>'; 
    
    var page = {
        css : custom_css,
        breadcrump : "show year logs",
        h1 : "Show year logs",
        logs : req.logList,
        js : custom_js,
        script : ""
    };

    res.render('logs-show.ejs', page);
});

module.exports = router;