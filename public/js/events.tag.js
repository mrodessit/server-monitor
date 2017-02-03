
var tag = class {
    
    static create(domData) {
        var ajaxOptions = {
            url: appConfig.ajax.postTagAdd,
            data: domData.newTagData,
            notifyElement: domData.notify,
            submitElement: domData.submit,
            formElement: domData.form
        }

        ajaxHelper.postAddData(ajaxOptions);
    }

    static list(targetTable) {

        ajaxHelper.getListData(appConfig.ajax.getTagList, function(response) {
            var tableData = [];                

            for (var i=0; i<response.data.length; i++) {
                tableData.push([
                    response.data[i].id,
                    '<span style="color:#'+response.data[i].color+'">'+response.data[i].tag+'</span>',
                    response.data[i].is_system ? true : false,
                    response.data[i].color,
                    response.data[i].is_system ? "" : buttons.edit('tag', response.data[i].id) + buttons.delete('tag', response.data[i].id)
                ]);
            }

            $(targetTable).DataTable().clear().rows.add(tableData).draw();          
        },
        function(err) {
            console.log(err);
        });
    }

    static prepareDeleteInfo(domData) {        
        ajaxHelper.getDataById(appConfig.ajax.getTagById,
        function(serverData) {
            if (serverData.result) {                    
                domData.infoDiv.innerHTML = "<b>Id:</b> "+serverData.data.id+"<br><hr>"+"<b>name:</b> "+serverData.data.tag+"<br>";
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
        var tagId = getQueryParam("id");

        if (tagId) {
            var tagData = { id: tagId };

            var options = {
                url: appConfig.ajax.postTagDelete,
                data: tagData,
                notifyElement: domData.notify,
                submitElement: domData.submit
            }

            ajaxHelper.postDeleteById(options);
        }
        else {
            domData.notify.notifyShow("error", "Error: no tag id.");
        }
    }

    static prepareEditInfo(domData) {
        ajaxHelper.getDataById(appConfig.ajax.getTagById,
        function(serverData) {
            if (serverData.result) {                    
                domData.inputId.value = serverData.data.id;
                domData.inputOldName.value = serverData.data.tag;                                
                domData.inputColor.color = '#'+serverData.data.color;                
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

    static edit(domData) {

        var options = {
            url: appConfig.ajax.postTagUpdate,
            data: domData.editTagData,
            notifyElement: domData.notify,
            submitElement: domData.submit,
            formElement: null
        }        

        ajaxHelper.postAddData(options);
    }

    static listSelectable(targetTable) {
        ajaxHelper.getListData(appConfig.ajax.getTagListEditable, function(response) {
            var columnCount = 4;
            var tableSize = ( columnCount - response.data.length % columnCount ) + response.data.length;
            var tableData = [];  
            var rowArray = [];            

            for (var i=0; i<tableSize; i++) {
                        
                if (response.data[i] !== undefined)
                    rowArray.push(buttons.tagSelectable(response.data[i]));
                else    
                    rowArray.push('');
                
                if (rowArray.length == columnCount) {
                    tableData.push(rowArray);
                    rowArray = [];
                }
            }              

            $(targetTable).DataTable().clear().rows.add(tableData).draw();          
        },
        function(err) {
            console.log(err);
        });
    }
}