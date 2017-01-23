var express      = require('express');
var router       = express.Router();
var tag          = require('../models/tag');
var jsonResponse = require('../helpers/json-response');

router.post('/tag/add', (req, res) => {
    if ("tag" in req.body && "color" in req.body) {
        var userId = 0; // TODO get user ID from session

        tag.create(req.body, userId, (result, data) => {        
            if (result) {
                res.json(jsonResponse.Success(data));
            }
            else {
                res.json(jsonResponse.Error(data));
            }
        });
    }
    else {
        res.json(jsonResponse.Error("Error: incorrect params"));
    }    
});

router.post('/tag/delete', (req, res) => {
    if ("id" in req.body) {
        tag.delete(req.body.id, (result, data) => {       
            if (result) {
                res.json(jsonResponse.Success(data));
            }
            else {
                res.json(jsonResponse.Error(data));
            }
        });
    }
    else {
        res.json(jsonResponse.Error("Error: incorrect request params."));
    }    
});

router.post('/tag/update', (req, res) => {
    if ("id" in req.body && "tag" in req.body && "color" in req.body) {
        tag.update(req.body, (result, data) => {
        
            if (result) {
                res.json(jsonResponse.Success(data));
            }
            else {
                res.json(jsonResponse.Error(data));
            }
        });
    }
    else {
        res.json(jsonResponse.Error("Error: incorrect params"));
    }    
});

router.get('/tag/get/id/:id', (req, res) => {     
    tag.findById(req.params.id, (result, data) => {
        if (result) {
            res.json(jsonResponse.Data(data));
        }
        else {
            res.json(jsonResponse.Error(data));
        }
    });
});

router.get('/tag/get/name/:name', (req, res) => {
    tag.findByName(req.params.name, (result, data) => {
        if (result) {
            if (data != null) { // user found
                res.json(jsonResponse.Data(data));
            }
            else { // user not found
                res.json(jsonResponse.Error('Error: no user found!'));
            }
        }
        else { // error while get all users
            res.json(jsonResponse.Error(data));
        }
    });
});

router.get('/tag/get/list', (req, res) => {
    tag.list((result, data) => {
        if (result) {
            res.json(jsonResponse.Data(data));
        }
        else {
            res.json(jsonResponse.Error(data));
        }
    });
});

module.exports = router;