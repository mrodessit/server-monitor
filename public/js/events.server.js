
var server = class {

    static create(domData) {
        var serverData = {
            servers: domData.newServersData
        };

        var options = {
            url: appConfig.ajax.postServerAdd,
            data: serverData,
            notifyElement: domData.notify,
            submitElement: domData.submit,
            formElement: domData.form
        }

        ajaxHelper.postAddData(options);
    }

    static togglePauseRun(domData) {        

        ajaxHelper.getListData(appConfig.ajax.getServerPauseRun + domData.id,
        function(response) {
            if (response.result) {
                $(domData.table).DataTable().ajax.reload(null, false);
            }
            else {
                console.log(response);
            }
        },
        function(err) {
            console.log(err);
        });
    }

    static prepareInfo(domData) {
        var serverId = getQueryParam("id");        

        ajaxHelper.getListData(appConfig.ajax.getServerIds + serverId,
        function(serverData) {
            if (serverData.result) {                    
                var tableData = [];                

                for (var i=0; i<serverData.data.length; i++) {
                    tableData.push([
                        serverData.data[i].id,
                        serverData.data[i].ip,
                    ]);
                }

                $(domData.table).DataTable().clear().rows.add(tableData).draw(); 
                domData.submit.disabled = false;
            }
            else {
                domData.notify.notifyShow("error", serverData.msg);
            }
        },
        function(err) {
            domData.notify.notifyShow("error", err);
        });
    }

    static delete(domData) {
        var serverId = getQueryParam("id");
    
        if (serverId) {
            var options = {
                url: appConfig.ajax.getServerDelete + serverId,  
                notifyElement: domData.notify,
                submitElement: domData.submit
            }

            ajaxHelper.getDeleteById(options);
        }
        else {
            domData.notify.notifyShow("error", "Error: no tag id.");
        }
    }

    static editTags(domData) {
        var serverId = getQueryParam("id");        

        var serverTagsData = {
            servers: serverId.split(','),
            tags: domData.tags.split(' ')
        }

        var postOptions = {
            url: appConfig.ajax.postServerTags + domData.action,
            data: serverTagsData,
            notifyElement: domData.notify,
            submitElement: null,
            formElement: null
        }
        
        ajaxHelper.postAddData(postOptions);
    }
}