var express      = require('express');
var router       = express.Router();
var log          = require('../models/log.js');
var jsonResponse = require('../helpers/json-response');

router.get('/log/server/id/:id', (req, res) => { 
    log.findByServerId(req.params.id, (result, data) => {
        if (result) {
            res.json(jsonResponse.Data(data));
        }
        else {
            res.json(jsonResponse.Error(data));
        }
    });
});

router.get('/log/date/:type', (req, res) => { // date types: day, month, year 
    var dateNow = new Date();
    var start   = new Date();
    var end     = new Date();

    switch (req.params.type) {
        case "day":
            start.setHours(0,0,0,0);
            end.setHours(23,59,59,999);       
            break;

        case "month":
            start = new Date(dateNow.getFullYear(), dateNow.getMonth(), 1);
            end = new Date(dateNow.getFullYear(), dateNow.getMonth()+1, 0);    
            break;

        case "year":
            start = new Date(dateNow.getFullYear(), 0, 1);
            end = new Date(dateNow.getFullYear(), 11, 31);
            break;
    
        default:
            break;
    }    

    log.findByDateRange(start.getTime(), end.getTime(), (result, data) => {
        if (result) {
            res.json(jsonResponse.Data(data));
        }
        else {
            res.json(jsonResponse.Error(data));
        }
    });
});

module.exports = router;