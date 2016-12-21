var express         = require('express');
var router          = express.Router();
var notification    = require('../helpers/notification');
var misc_mw         = require('../middlewares/misc'); // overall middleware functions
var mw              = require('../middlewares/servers'); // middleware functions for this controller

router.get('/servers-add', misc_mw.lookGet, function(req, res) {
    var msg = notification.show(req.notification);
    
    var page = {
        css : "",
        breadcrump : "add servers",
        h1 : "add servers",
        msg : msg,
        js : "",
        script : ""
    };

    res.render('servers-add.ejs', page);
});

router.post('/servers-add', mw.addServers, function(req, res) {
    res.redirect('/servers-add');
});

router.get('/servers-list', mw.getServersList, function(req, res) {
    
    var custom_css = '<link rel="stylesheet" href="resource/css/uniform.css" /><link rel="stylesheet" href="resource/css/select2.css" />';
    var custom_js = 
    '<script src="resource/js/jquery.uniform.js"></script>'+
    '<script src="resource/js/select2.min.js"></script>'+    
    '<script src="//cdn.datatables.net/1.10.13/js/jquery.dataTables.min.js"></script>'+
    '<script src="resource/js/custom.datatables.js"></script>'; 
    
    var page = {
        css : custom_css,
        breadcrump : "show servers",
        h1 : "Server list",
        tableData : req.ServerTableContent,
        js : custom_js,
        script : ""
    };

    res.render('servers-list.ejs', page);
});

router.get('/servers-edit', mw.checkParams, mw.editAction, mw.editTodo, function(req, res) {

    if (req.query.action)
    {
        var page = {
            css : "",
            breadcrump : req.actionBreadcrump,
            h1 : req.actionH1,
            text : req.actionText,
            data : req.actionData,
            js : "",
            script : ""
        };

        res.render('servers-edit-'+req.query.action+'.ejs', page);
    }
    else
    {
        res.redirect('/error?error=no_correct_action');
    }    
});

router.get('/servers-edit-tags', mw.checkParams, mw.editTagAction, function(req, res) {

    var script = 
        '<script>'+
        'function addTag(tag)'+
        '{'+
            'var tval = $("#tag-list").val();'+
            'if (tval.indexOf(tag) == -1){'+
            'if (tval.length <= 0) tval += tag;'+
            'else tval += " " + tag;'+
            '$("#tag-list").val(tval);}'+            
        '}'+
        '</script>';

    var page = {
        css : "",
        breadcrump : req.actionBreadcrump,
        h1 : req.actionH1,
        text : req.actionText,
        data : req.actionData,
        tagData : req.actionTagTable,
        js : "",
        script : script
    };

    res.render('servers-edit-tags.ejs', page);
});

router.post('/servers-edit-tags', mw.checkEditTagsParams, mw.editTagTodo, function(req, res) {
    res.redirect('/servers-list');
});

module.exports = router;