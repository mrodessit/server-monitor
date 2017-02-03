
var log = class {

    static findByDate(dateType, targetTable) {
        var ajaxUrl = appConfig.ajax.getLogsDate + dateType;

        ajaxHelper.getListData(ajaxUrl, 
        function(response) { // success
            var tableData = [];                

            for (var i=0; i<response.data.length; i++) {
                tableData.push([
                    response.data[i].server,
                    response.data[i].ip,
                    response.data[i].event,
                    new Date(response.data[i].date).toUTCString()
                ]);
            }

            $(targetTable).DataTable().clear().rows.add(tableData).draw();          
        },
        function(err) { // error
            console.log(err);
        });
    }    

    static findById(domData) {
        var serverId = getQueryParam("id");        

        ajaxHelper.getListData(appConfig.ajax.getLogsById + serverId, 
        function(response) { // success
            if (response.result) {                
                var tableData = [];                

                for (var i=0; i<response.data.length; i++) {
                    tableData.push([
                        response.data[i].server,
                        response.data[i].ip,
                        response.data[i].event,
                        response.data[i].date,
                    ]);
                }
                
                $(domData.table).DataTable().clear().rows.add(tableData).draw();          
            }
            else {
                domData.notify.notifyShow("error", "Error: no data for that id.");
            }            
        },
        function(err) { // error
            domData.notify.notifyShow("error", "Error: ajax error.");
        });
    }
}