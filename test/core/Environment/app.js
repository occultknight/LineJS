line.module(['core', 'util'], function (core, util) {
    var global = line.global;
    if (global.document) {
        console.info('client info', core.Environment.client);
    } else {
        console.info('server info', core.Environment.server);
    }
});
