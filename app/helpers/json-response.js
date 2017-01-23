
// server response schema
var responseJSON = {
    result: null,
    msg: null,
    data: null
};

exports.Success = function(msg) {    
    var resultResponseJSON = responseJSON;

    resultResponseJSON.result = true;
    resultResponseJSON.msg = msg;
    resultResponseJSON.data = null;

    return resultResponseJSON;
}

exports.Error = function(msg) {
    var resultResponseJSON = responseJSON;

    resultResponseJSON.result = false;
    resultResponseJSON.msg = msg;
    resultResponseJSON.data = null;

    return resultResponseJSON;
}

exports.Data = function(data) {
    var resultResponseJSON = responseJSON;

    resultResponseJSON.result = true;
    resultResponseJSON.msg = null;
    resultResponseJSON.data = data;

    return resultResponseJSON;
}