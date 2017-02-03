
var ajaxHelper = class {

    static postAddData (options) {
        $.ajax({
            url: options.url,
            type: "POST",
            data: options.data,
            dataType: "json",
            cache: false,
            xhrFields: { withCredentials: true },
            success: function(response, status, jqXHR) {                
                if (response.result) {
                    options.notifyElement.notifyShow("success", response.msg);
                }
                else {                    
                    options.notifyElement.notifyShow("error", response.msg);
                }

                if (options.submitElement) options.submitElement.disabled = true;
                if (options.formElement) options.formElement.reset();
            }, 
            error: function(jqXHR, textStatus, errorThrown ) {
                options.notifyElement.notifyShow("error", "Error: no ajax response!");
            }
        });
    }

    static postDeleteById(options) {        
        $.ajax({
            url: options.url,
            type: "POST",
            data: options.data,
            dataType: "json",
            cache: false,
            xhrFields: { withCredentials: true },
            success: function(response, status, jqXHR) {                
                if (response.result) {
                    options.notifyElement.notifyShow("success", response.msg);
                }
                else {
                    options.notifyElement.notifyShow("error", response.msg);
                }
                options.submitElement.disabled = true;
            }, 
            error: function(jqXHR, textStatus, errorThrown ) {                    
                options.notifyElement.notifyShow("error", "Error: no ajax response.");
            }
        });
    }

    static getDataById(ajaxUrl, success, error) {
        var queryId = getQueryParam("id");

        if (queryId) {
            $.ajax({
                url: ajaxUrl+"/"+queryId,
                method: "GET",
                dataType: "json",
                cache: false,
                xhrFields: { withCredentials: true },
                success: function(response, status, jqXHR) {
                    if ("result" in response) {
                        success(response);
                    }
                    else {
                        error("Error: invalid response data.");
                    }
                },
                error: function(jqXHR, textStatus, errorThrown ) {
                    error("Error: no ajax response.");
                }
            });
        }
        else {
            error("Error: incorrect id.");
        }
    }

    static getListData(ajaxUrl, success, error) {
        $.ajax({
            url: ajaxUrl,
            method: "GET",
            dataType: "json",
            cache: false,
            xhrFields: { withCredentials: true },
            success: function(response, status, jqXHR) {
                if (response.result) {
                    success(response);
                }
                else {
                    error(response.msg);
                }
            },
            error: function(jqXHR, textStatus, errorThrown ) {
                error("Error: with ajax request.");
            }
        });
    }

    static getDeleteById(options) {        
        $.ajax({
            url: options.url,
            type: "GET",            
            dataType: "json",
            cache: false,
            xhrFields: { withCredentials: true },
            success: function(response, status, jqXHR) {                
                if (response.result) {
                    options.notifyElement.notifyShow("success", response.msg);
                }
                else {
                    options.notifyElement.notifyShow("error", response.msg);
                }
                options.submitElement.disabled = true;
            }, 
            error: function(jqXHR, textStatus, errorThrown ) {                    
                options.notifyElement.notifyShow("error", "Error: no ajax response.");
            }
        });
    }
}