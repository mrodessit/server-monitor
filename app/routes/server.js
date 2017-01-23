var express      = require('express');
var router       = express.Router();
var server       = require('../models/server');
var jsonResponse = require('../helpers/json-response');

router.post('/server/add/array', (req, res) => {
    if ("servers" in req.body) {        
        var ipArray = req.body.servers.split(/\r?\n/);
        
        server.createFromArray(ipArray, (result, data) => {
            if (result) {
                res.json(jsonResponse.Success(data));
            }
            else {
                res.json(jsonResponse.Error(data));
            }
        });
    }
    else {
        res.json(jsonResponse.Error("Error: incorrect params!"));
    }
});

router.post('/server/tags/:action', (req, res) => {
    if ("servers" in req.body && "tags" in req.body && (req.params.action == 'insert' || req.params.action == 'delete')) {
        var tagsData = { servers: req.body.servers, tags: req.body.tags, action : req.params.action };

        var userId = 0; // TO-DO: get userId from session

        server.editServerTags(tagsData, userId, (result, data) => {
            if (result) {
                res.json(jsonResponse.Success(data));
            }
            else {
                res.json(jsonResponse.Error(data));
            }
        })
    }
    else {
        res.json(jsonResponse.Error("Error: incorrect params!"));
    }
});

router.get('/server/delete/:ids', (req, res) => {
    var idArray = req.params.ids.split(',');

    server.delete(idArray, (result, data) => {
        if (result) {
            res.json(jsonResponse.Success(data));
        }
        else {
            res.json(jsonResponse.Error(data));
        }
    });
});

router.get('/server/pause-run/:ids', (req, res) => {
    var idArray = req.params.ids.split(',');
    var userId = 0; // TO-DO: get userId from session

    server.togglePauseRun(idArray, userId, (result, data) => {
        if (result) {
            res.json(jsonResponse.Success(data));
        }
        else {
            res.json(jsonResponse.Error(data));
        }
    });
});

router.get('/server/get/list', (req, res) => {
    server.list((result, data) => {
        if (result) {
            res.json(jsonResponse.Data(data));
        }
        else {
            res.json(jsonResponse.Error(data));
        }
    });
});

router.get('/server/get/id/:ids', (req, res) => {    
    var idArray = req.params.ids.split(',');

    server.findById(idArray, (result, data) => {
        if (result) {
            res.json(jsonResponse.Data(data));
        }
        else {
            res.json(jsonResponse.Error(data));
        }
    });
});

router.get('/server/get/ip/:ips', (req, res) => {
    var ipArray = req.params.ips.split(',');

    server.findByIp(ipArray, (result, data) => {
        if (result) {
            res.json(jsonResponse.Data(data));
        }
        else {
            res.json(jsonResponse.Error(data));
        }
    });
});

module.exports = router;