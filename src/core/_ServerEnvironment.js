line.module([], function () {

    var GLOBAL = line.GLOBAL;

    /**
     * @module core
     * @class _ServerEnvironment
     */
    return line.define('_ServerEnvironment', {
        static: true,
        properties: {
            env: {
                get: function () {
                    return GLOBAL.process.env;
                }
            }
        },
        methods: {
            support: function (propertyName) {
                return true;
            }
        }
    });

});