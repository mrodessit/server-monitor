
var appConfig = {
    ajax: {
        //server manage ajax urls        
        postServerAdd: "/api/server/add/array",
        postServerTags: "/api/server/tags/",
        getServerDelete: "/api/server/delete/",
        getServerPauseRun: "/api/server/pause-run/",
        getServerIds: "/api/server/get/id/",
        getServerIps: "/api/server/get/ip/",
        getServerList: "/api/server/get/datatable",

        //logs manage ajax urls
        getLogsDate: "/api/log/date/",
        getLogsById: "/api/log/server/id/",

        //tag manage ajax urls
        getTagList: "/api/tag/get/list",
        getTagListEditable: "/api/tag/get/editable",
        getTagById: "/api/tag/get/id",        
        postTagDelete : "/api/tag/delete",
        postTagUpdate : "/api/tag/update",
        postTagAdd: "/api/tag/add",
        
        //user manage ajax urls
        getUserList: "/api/user/get/list",
        getUserById: "/api/user/get/id",
        postUserAdd: "/api/user/add",
        postUserDelete : "/api/user/delete",
        postUserUpdate : "/api/user/update"
    },
    event: {
        serverAdd: "server-add",        
        serverDelete: "server-delete",
        serverEditTags: "server-edit-tags",
        serverPauseRun: "server-pause-run",    
        serverPrepareIdInfo: "server-prepare-id-info",

        logsDate: "logs-list",
        logsById: "logs-by-id",

        tagAdd: "tag-add",
        tagList: "tag-list-reload",
        tagPrepareDelete: "tag-prepare-delete",
        tagPrepareEdit: "tag-prepare-edit",
        tagDelete: "tag-delete",
        tagEdit: "tag-edit",
        tagListSelectable: "tag-list-selectable",

        userAdd: "user-add",
        userList: "user-list-reload",
        userPrepareDelete: "user-prepare-delete",
        userPrepareEdit: "user-prepare-edit",
        userDelete: "user-delete",
        userEdit: "user-edit"
    }
}