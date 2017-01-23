var express     = require('express');
var router      = express.Router();
var user        = require('../models/user');
var jsonResponse = require('../helpers/json-response');

router.post('/user/add', (req, res) => {
    user.create(req.body, (result, data) => {    
        if (result) {
            res.json(jsonResponse.Success(data));
        }
        else {
            res.json(jsonResponse.Error(data));
        }
    });
});

router.post('/user/delete', (req, res) => {
    if ("id" in req.body) {
        user.delete(req.body.id, (result, data) => {     
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

router.post('/user/update', (req, res) => {   
    user.update(req.body, (result, data) => {      
        if (result) {
            res.json(jsonResponse.Success(data));
        }
        else {
            res.json(jsonResponse.Error(data));
        }
    });
});

router.get('/user/get/id/:id', (req, res) => {    
    user.findById(req.params.id, (result, data) => {
        if (result) {
            res.json(jsonResponse.Data(data));
        }
        else {
            res.json(jsonResponse.Error(data));
        }
    });
});

router.get('/user/get/name/:name', (req, res) => {  
    user.findByName(req.params.name, (result, data) => {
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

router.get('/user/get/list', (req, res) => {
    user.list((result, data) => {
        if (result) {
            res.json(jsonResponse.Data(data));
        }
        else {
            res.json(jsonResponse.Error(data));
        }
    });
});

module.exports = router;