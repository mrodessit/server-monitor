var express         = require('express');
var router          = express.Router();
var modelUsers      = require('../models/tags');
var notification    = require('../helpers/notification');
var misc_mw         = require('../middlewares/misc'); // overall middleware functions
var mw              = require('../middlewares/tags'); // middleware functions for this controller

router.get('/tags-show', mw.getTagsAll, function(req, res) {
    
    var custom_js = '<script src="resource/js/jquery.uniform.js"></script><script src="resource/js/select2.min.js"></script><script src="resource/js/jquery.dataTables.min.js"></script><script src="resource/js/matrix.tables.js"></script>'; 

    var page = {
        css : '<link rel="stylesheet" href="resource/css/uniform.css" /><link rel="stylesheet" href="resource/css/select2.css" />',
        breadcrump : "show all tags",
        h1 : "Show all tags",
        tags : req.tagList,
        js : custom_js,
        script : ""
    };

    res.render('tags-show.ejs', page);
});

router.get('/tags-add', misc_mw.lookGet, function(req, res) {
    
    var custom_css = '<link rel="stylesheet" href="resource/css/colorpicker.css" />';
    var custom_js = '<script src="resource/js/bootstrap-colorpicker.js"></script> ';

    var script = 
    '<script>'+
    '$(document).ready(function(){'+    
        "$('.colorpicker').colorpicker();"+
        "if($('div').hasClass('picker')){"+
            "$('.picker').farbtastic('#color');"+
        '}'+
    '});</script>';

    var msg = notification.show(req.notification);

    var page = {
        css : custom_css,
        breadcrump : "add tag",
        h1 : "Add tag",
        msg : msg,
        js : custom_js,
        script : script
    };

    res.render('tags-add.ejs', page);
});

router.post('/tags-add', mw.addTag, function(req, res) {
    res.redirect('/tags-add');
});

router.get('/tags-edit', mw.editTodo, mw.editAction, function(req, res) {
    if (req.query.action == "delete") {
        var page = {
            css : "",
            breadcrump : "delete tag",
            h1 : "Delete tag",
            text : "Delete tag id: "+req.query.id,
            id : req.query.id,
            js : "",
            script : ""
        };

        res.render('tags-edit-delete.ejs', page);
    } else {
        res.redirect('/error?error=bad_params');
    }    
});

module.exports = router;