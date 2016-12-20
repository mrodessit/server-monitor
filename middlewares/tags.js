var modelTags   = require('../models/tags');
var validator    = require('../helpers/validator');

var getTagsAll = function(req, res, next) {

    var is_system = {};
    is_system[1] = '<span class="label label-success">system</span>';
    is_system[0] = '<span class="label label-info">user</span>';

    modelTags.showAll()
        .then(function(tags) {
            
            for (var i=0; i<tags.length; i++)
            {
                tags[i].is_system_span = is_system[tags[i].is_system];
                
                if (validator.isEmpty(tags[i].color)) tags[i].color = '000000';
                
                if (validator.isEmpty(tags[i].username)) tags[i].username = '<span class="label label-success">system</span>';
            }

            req.tagList = tags;

            next();
        })
        .catch(function(err) {
            console.log(err);
            res.redirect('/error?error='+err);
        });           
}

var addTag = function(req, res, next) {

    if (!validator.isEmptyGetParams(req.body, ['tagname', 'color']))
    {
        var tag_color = req.body.color.replace('#', '');

        var tagData = {
            tag : req.body.tagname,
            color : tag_color,
            user_id : req.session.passport.user.id
        };

        modelTags.addItem(tagData)
            .then(function() {
                res.redirect('/tags-add?status=success');
            })
            .catch(function(err) {
                console.log(err);
                res.redirect('/tags-add?status=error&error='+err);
            });    
    }
    else
    {
        next();
    }   
}

var editTodo = function(req, res, next) {

    if (!validator.isEmpty(req.query.id))
    {    
        if (!validator.isEmpty(req.query.todo)) {

            modelTags.deleteItem(req.query.id)
                .then(function() {
                    res.redirect('/tags-show');
                })
                .catch(function(err){
                    res.redirect('/error?error='+err);
                });
        } 
        else {
            next();
        }
    } 
    else {
        res.redirect('/error?error=no_id');
    }
}

var editAction = function(req, res, next) {
    
    if (!validator.isEmpty(req.query.action) && req.query.action == "delete") {        
        next();
    }
    else {
        res.redirect('/error?error=bad_action');
    }
}

exports.editAction = editAction;
exports.editTodo = editTodo;
exports.addTag = addTag;
exports.getTagsAll = getTagsAll;