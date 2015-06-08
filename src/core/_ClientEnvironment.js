line.module([], function () {

    var GLOBAL = line.GLOBAL;
    var supportBrowserList = ['Chrome', 'Firefox', 'Safari', 'Opera', 'Ie'];
    var userAgent = GLOBAL.navigator && GLOBAL.navigator.userAgent;
    var engineMap = {
        'webkit': 'it/',    //safari/new opera/chrome/default
        'gecko': 'rv:',     //firefox
        'presto': 'to/',    //old opera
        'trident': 'nt/'    //ie
    };
    var vendorMap = {
        'webkit': ['Webkit', '-webkit-'],
        'gecko': ['Moz', '-moz-'],
        'presto': ['O', '-o-'],
        'trident': ['ms', '-ms-']
    };

    /**
     * @module core
     * @class _ClientEnvironment
     */
    return line.define('_ClientEnvironment', {
        static: true,
        properties: {
            env: {
                get: function () {
                    if (!this._env) {
                        this.__initEnvironment();
                    }
                    return this._env;
                }
            }
        },
        methods: {
            support: function (propertyName) {
                return true;
            },
            is: function () {
                return !!GLOBAL.document;
            },
            __initEnvironment: function () {
                var env,
                    whichBrowser,
                    browserName,
                    browserVersion;
                var i = 0,
                    length = supportBrowserList.length,
                    value;
                for (; i < length; i++) {
                    value = supportBrowserList[i];
                    whichBrowser = this['__is' + value]();
                    browserName = value.toLowerCase();

                    if (whichBrowser) {
                        browserVersion = parseFloat(this['__' + browserName + 'Version']());
                        break;
                    }
                }

                env = {
                    userAgent: userAgent,
                    name: browserName,
                    version: browserVersion,
                    engine: this.__getEngine(),
                    prefix: this.__vendorPrefix(false),
                    cssPrefix: this.__vendorPrefix(true)
                };

                //fix for ie7
                if (this.__isIe() && this.__ieVersion() === 7) {
                    env.engine = {
                        name: 'trident'
                    };
                }
                this._env = env;
            },
            __isIe: function () {
                return userAgent.indexOf('MSIE ') > -1;
            },
            __ieVersion: function () {
                return userAgent.match(/MSIE (\d+\.\d+)/)[1];
            },

            __isChrome: function () {
                return userAgent.indexOf('Chrome/') > -1 && !this.__isOpera();
            },
            __chromeVersion: function () {
                return userAgent.match(/Chrome\/(\d+\.\d+)/)[1];
            },

            __isSafari: function () {
                return userAgent.indexOf('Safari/') > -1 && !this.__isChrome() && !this.__isOpera();
            },
            __safariVersion: function () {
                return userAgent.match(/Version\/(\d+\.\d+)/)[1];
            },

            __isFirefox: function () {
                return userAgent.indexOf('Firefox/') > -1;
            },
            __firefoxVersion: function () {
                return userAgent.match(/Firefox\/(\d+\.\d+)/)[1];
            },

            __isOpera: function () {
                return userAgent.indexOf('Opera/') > -1 || userAgent.indexOf('OPR/') > -1;
            },
            __operaVersion: function () {
                return (userAgent.match(/Opera\/(\d+\.\d+)/) || userAgent.match(/OPR\/(\d+\.\d+)/))[1];
            },

            __vendorPrefix: function (isCamelize) {
                var camelize = isCamelize | 0;
                var engineName = this.__getEngine().name;
                return vendorMap[engineName][camelize];
            },
            __getEngine: function () {
                var key, value;
                var engine = {};
                for (key in engineMap) {
                    value = engineMap[key];
                    if (userAgent.indexOf(value) > -1) {
                        engine.name = key;
                        engine.version = parseFloat(this.__getEngineVersion(value));
                        break;
                    }
                }

                return engine;
            },
            __getEngineVersion: function (keyRegexp) {
                var versionExp = new RegExp('(?:\\w+|\\s+)' + keyRegexp + '(\\d+\\.\\d+)');
                return userAgent.match(versionExp)[1];
            }
        }
    });

});