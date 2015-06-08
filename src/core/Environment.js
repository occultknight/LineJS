line.module([
    './_ClientEnvironment',
    './_ServerEnvironment'
], function (_ClientEnvironment, _ServerEnvironment) {

    /**
     * @module core
     * @class Environment
     */
    return line.define('Environment', {
        'static': true,
        properties: {
            client: null,
            server: null
        },
        methods: {
            init: function () {
                if (_ClientEnvironment.is()) {
                    this.set('client', _ClientEnvironment.get('env'));
                } else {
                    this.set('server', _ServerEnvironment.get('env'));
                }
            },
            support: function (propertyName) {
                if (this.get('client')) {
                    return _ClientEnvironment.support(propertyName);
                } else {
                    return _ServerEnvironment.support(propertyName);
                }
            }
        }
    });

});