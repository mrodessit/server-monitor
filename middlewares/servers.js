var modelServers    = require('../models/servers');
var dateHelper      = require('../helpers/date');
var validator       = require('../helpers/validator');
var tablesHelper    = require('../helpers/tables');

var addServers = function(req, res, next) {
    
    var serverArr = req.body.servers;

    serverArr = serverArr.split(/\r\n/);

    modelServers.addItems(serverArr, 
    function(type, text) {
        res.redirect('/servers-add?status='+type+'&text='+text);
    });
}

var getServersList = function(req, res, next) {
    
    modelServers.showItems()
        .then(function(servers) {

            req.ServerTableContent = tablesHelper.generateServerTable(servers);

            next();
        })
        .catch(function(err) {
            console.log(err);
            res.redirect('/error?error='+err);
        });
}

function PauseRun(req, res)
{
    if (!validator.isEmpty(req.query.id)) // single server action
    {
        modelServers.serverPauseRun(req.query.id, req.session.passport.user.id)
            .then(function() {
                res.redirect("/servers-list");
            })
            .catch(function(err) {
                res.redirect('/error?error='+err);
            });
    }
    else if (!validator.isEmpty(req.query.idArr)) // multiple server actions
    {
        modelServers.serverArrPauseRun(req.query.idArr, 
        function(status){
            if (status == 'success') {
                res.redirect("/servers-list");
            } else {
                res.redirect('/error?error=error_db');
            }
        });
    }
    else
    {
        res.redirect('/error?error=error_get_params');
    }
}

function DeleteServers(req, res)
{
    if (!validator.isEmpty(req.query.id)) // single server action
    {
        modelServers.serverDelete(req.query.id)
            .then(function() {
                res.redirect("/servers-list");
            })
            .catch(function(err) {
                res.redirect('/error?error='+err);
            });
    }
    else if (!validator.isEmpty(req.query.idArr)) // multiple server actions
    {
        modelServers.serverArrDelete(req.query.idArr, 
        function(status){
            if (status == 'success') {
                res.redirect("/servers-list");
            } else {
                res.redirect('/error?error=error_db');
            }
        });
    }
    else
    {
        res.redirect('/error?error=error_get_params');
    }
}

var editTodo = function(req, res, next) {

    if (!validator.isEmpty(req.query.todo))
    {
        switch (req.query.todo) {
            case "pause-run":
                PauseRun(req, res);                
                break;

            case "delete":
                DeleteServers(req, res);
                break;    
        
            default:
                break;
        }
    }
    else
    {
        next();
    }
}

function generateFormText(req)
{
    if (!validator.isEmpty(req.query.id) ) {
        return "<b> Server id : "+req.query.id+" </b>";
    } else if (!validator.isEmpty(req.query.idArr)) {
        var text = "";
        var idArr = req.query.idArr.split(',');
        
        for(var i=0; i<idArr.length; i++)
        {
            text += "<b> Server id : "+idArr[i]+" </b><br/>"; 
        }

        return text;
    } else {
        return "";
    }
}

function generateFormData(req)
{
    if (!validator.isEmpty(req.query.id) ) {
        return '<input type="hidden" name="todo" value="delete" /><input type="hidden" name="id" value="'+req.query.id+'" />';
    } else if (!validator.isEmpty(req.query.idArr)) {
        return '<input type="hidden" name="todo" value="delete" /><input type="hidden" name="idArr" value="'+req.query.idArr+'" />';
    } else {
        return "";
    }
}

var editAction = function(req, res, next) {

    if (!validator.isEmpty(req.query.action) )
    {
        req.actionText = generateFormText(req);
        req.actionData = generateFormData(req);
        
        switch (req.query.action) {
            case "delete":                                                    
                req.actionBreadcrump = "delete server";
                req.actionH1 = "Delete server";
                next();
                break;
        
            default:
                res.redirect('/error?error=no_correct_action');
                break;
        }
    }
    else
    {
        next();
    }
}

var checkParams = function(req, res, next) {
    if (!validator.isEmpty(req.query.id) || !validator.isEmpty(req.query.idArr)) {
        next();
    } else {
        res.redirect('/error?error=no_correct_params');
    }
}

var editTagAction = function(req, res, next) {
    
    req.actionText = generateFormText(req);
    req.actionData = generateFormData(req);
    req.actionBreadcrump = "edit tags servers";
    req.actionH1 = "Edit tags servers";

    modelServers.getAllTags()
        .then(function(tags) {
            req.actionTagTable = tablesHelper.generateTagTable(tags, 4);

            next();
        })
        .catch(function(err) {
            res.redirect('/error?error='+err);
        });
}

var checkEditTagsParams = function(req, res, next) {

    if (!validator.isEmpty(req.body.id) || !validator.isEmpty(req.body.idArr))
    {
        if (validator.isEmpty(req.body.tagnames) || validator.isEmpty(req.body.choice))
        {
            res.redirect("/error?error=invalid_post_params.Missing_form_data");    
        }
        else
        {
            next();
        }
    }
    else
    {
        res.redirect("/error?error=invalid_post_params.Missing_data");
    }
}

function AddTagsToServers(req, res)
{
    if (!validator.isEmpty(req.body.id)) // single server action
    {
        modelServers.serverAddTags(req.body.id, req.body.tagnames, req.session.passport.user.id)        
            .then(function() {
                res.redirect("/servers-list");
            })
            .catch(function(err) {
                res.redirect('/error?error='+err);
            });
    }
    else if (!validator.isEmpty(req.query.idArr)) // multiple server actions
    {
        modelServers.serverArrAddTags(req.body.idArr, req.body.tagnames, req.session.passport.user.id)        
            .then(function() {
                res.redirect("/servers-list");
            })
            .catch(function(err) {
                res.redirect('/error?error='+err);
            });
    }
    else
    {
        res.redirect('/error?error=error_params');
    }
}

function DeleteTagsToServers(req, res)
{
    if (!validator.isEmpty(req.body.id)) // single server action
    {
        modelServers.serverDeleteTags(req.body.id, req.body.tagnames, req.session.passport.user.id)        
            .then(function() {
                res.redirect("/servers-list");
            })
            .catch(function(err) {
                res.redirect('/error?error='+err);
            });
    }
    else if (!validator.isEmpty(req.query.idArr)) // multiple server actions
    {
        modelServers.serverArrDeleteTags(req.body.idArr, req.body.tagnames, req.session.passport.user.id)        
            .then(function() {
                res.redirect("/servers-list");
            })
            .catch(function(err) {
                res.redirect('/error?error='+err);
            });
    }
    else
    {
        res.redirect('/error?error=error_params');
    }
}

var editTagTodo = function(req, res, next) {

    if (req.body.choice == 'add')
    {
        AddTagsToServers(req, res);
    }
    else if (req.body.choice == 'delete')
    {
        DeleteTagsToServers(req, res);
    }
    else
    {
        res.redirect("/error?error=invalid_action");
    }
    
}

exports.editTagTodo = editTagTodo;
exports.checkEditTagsParams = checkEditTagsParams;
exports.editTagAction = editTagAction;
exports.checkParams = checkParams;
exports.editAction = editAction;
exports.editTodo = editTodo;
exports.getServersList = getServersList;
exports.addServers = addServers;