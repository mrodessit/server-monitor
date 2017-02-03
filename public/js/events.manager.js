var ee = new EventEmitter();

ee.addListener(appConfig.event.serverAdd, server.create);
ee.addListener(appConfig.event.serverPauseRun, server.togglePauseRun);
ee.addListener(appConfig.event.serverPrepareIdInfo, server.prepareInfo);
ee.addListener(appConfig.event.serverDelete, server.delete);
ee.addListener(appConfig.event.serverEditTags, server.editTags);

ee.addListener(appConfig.event.logsDate, log.findByDate);
ee.addListener(appConfig.event.logsById, log.findById);

ee.addListener(appConfig.event.tagAdd, tag.create);
ee.addListener(appConfig.event.tagList, tag.list);
ee.addListener(appConfig.event.tagPrepareDelete, tag.prepareDeleteInfo);
ee.addListener(appConfig.event.tagDelete, tag.delete);
ee.addListener(appConfig.event.tagPrepareEdit, tag.prepareEditInfo);
ee.addListener(appConfig.event.tagEdit, tag.edit);
ee.addListener(appConfig.event.tagListSelectable, tag.listSelectable);

ee.addListener(appConfig.event.userAdd, user.create);
ee.addListener(appConfig.event.userList, user.list);
ee.addListener(appConfig.event.userPrepareDelete, user.prepareDeleteInfo);
ee.addListener(appConfig.event.userDelete, user.delete);
ee.addListener(appConfig.event.userPrepareEdit, user.prepareEditInfo);
ee.addListener(appConfig.event.userEdit, user.edit);

