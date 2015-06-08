line.module(['core', './modules/','util'], function (c, m, util) {
    console.log(c);
    console.log(m);
    util.Logger.info("info");
    util.Logger.debug("debug");
    util.Logger.error("error");
    util.Logger.warn("warn");
});
