
var user = class {

    static create(domData) {
        var ajaxOptions = {
            url: appConfig.ajax.postUserAdd,
            data: domData.newUserData,
            notifyElement: domData.notify,
            submitElement: domData.submit,
            formElement: domData.form
        }

        ajaxHelper.postAddData(ajaxOptions);
    }

    static list(targetTable) {
        ajaxHelper.getListData(appConfig.ajax.getUserList, function(response) {
            var tableData = [];                

            for (var i=0; i<response.data.length; i++) {
                tableData.push([
                    response.data[i].id,
                    response.data[i].username,
                    response.data[i].isadmin,
                    buttons.edit('user', response.data[i].id) + buttons.delete('user', response.data[i].id)
                ]);
            }

            $(targetTable).DataTable().clear().rows.add(tableData).draw();                                          
        },
        function(err) {
            console.log(err);
        });
    }

    static prepareDeleteInfo(domData) {                
        ajaxHelper.getDataById(appConfig.ajax.getUserById,
        function(serverData) {
            if (serverData.result) {                    
                domData.infoDiv.innerHTML = 
                "<b>Id:</b> "+serverData.data.id+"<br><hr>"+"<b>Username:</b> "+serverData.data.username+"<br>";
                domData.buttonDelete.disabled = false;
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
        var userId = getQueryParam("id");

        if (userId) {
            var userData = { id: userId };

            var options = {
                url: appConfig.ajax.postUserDelete,
                data: userData,
                notifyElement: domData.notify,
                submitElement: domData.buttonDelete
            }

            ajaxHelper.postDeleteById(options);
        }
        else {
            domData.notify.notifyShow("error", "Error: no user id.");
        }
    }

    static prepareEditInfo(domData) {
        ajaxHelper.getDataById(appConfig.ajax.getUserById,
        function(serverData) {
            if (serverData.result) {                    
                domData.inputId.value = serverData.data.id;
                domData.inputUsername.value = serverData.data.username;
            }
            else {
                domData.notify.notifyShow("error", serverData.msg);
            }
        },
        function(err) {
            domData.notify.notifyShow("error", err);
        });
    }

    static edit(domData) {
        var options = {
            url: appConfig.ajax.postUserUpdate,
            data: domData.editUserData,
            notifyElement: domData.notify,
            submitElement: domData.submit,
            formElement: null
        }

        ajaxHelper.postAddData(options);
    }
}
