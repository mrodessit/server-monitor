var express     = require('express');
var router      = express.Router();
var user        = require('../models/user');
var jsonResponse = require('../helpers/json-response');

router.post('/user/add', (req, res) => {
    user.create(req.body, (err, data) => {    
        if (err) {
            res.json(jsonResponse.Error(err));            
        }
        else {
            res.json(jsonResponse.Success(data));            
        }
    });
});

router.post('/user/delete', (req, res) => {
    if ("id" in req.body) {
        user.delete(req.body.id, (err, data) => {     
            if (err) {
                res.json(jsonResponse.Error(err));                
            }
            else {
                res.json(jsonResponse.Success(data));
            }
        });
    }
    else {
        res.json(jsonResponse.Error("Error: incorrect request params."));
    }    
});

router.post('/user/update', (req, res) => {   
    user.update(req.body, (err, data) => {      
        if (err) {
            res.json(jsonResponse.Error(err));            
        }
        else {
            res.json(jsonResponse.Success(data));
        }
    });
});

router.get('/user/get/id/:id', (req, res) => {    
    user.findById(req.params.id, (err, data) => {
        if (err) {
            res.json(jsonResponse.Error(err));            
        }
        else {
            res.json(jsonResponse.Data(data));
        }
    });
});

router.get('/user/get/name/:name', (req, res) => {  
    user.findByName(req.params.name, (err, data) => {
        if (err) { // error while get all users
            res.json(jsonResponse.Error(err));            
        }
        else { 
            if (data != null) { // user found
                res.json(jsonResponse.Data(data));
            }
            else { // user not found
                res.json(jsonResponse.Error('Error: no user found!'));
            }
        }
    });
});

router.get('/user/get/list', (req, res) => {
    user.list((err, data) => {
        if (err) {
            res.json(jsonResponse.Error(err));            
        }
        else {
            res.json(jsonResponse.Data(data));
        }
    });
});

module.exports = router;