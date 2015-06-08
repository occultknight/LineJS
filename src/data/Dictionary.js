line.module([
    '../core/Iterable'
], function (Iterable) {

    var KeyIterator = line.define(Iterable, {
        methods: {
            init: function (dict) {
                this._dict = dict;
            },
            each: function (callback, context) {
                this._dict.each(function (item) {
                    callback.call(context, item.key);
                });
            }
        }
    });

    var ValueIterator = line.define(Iterable, {
        methods: {
            init: function (dict) {
                this._dict = dict;
            },
            each: function (callback, context) {
                this._dict.each(function (item) {
                    callback.call(context, item.value);
                });
            }
        }
    });

    /**
     * @class Dictionary
     * @extends line.Iterable
     * @constructor
     * @param dict
     */
    return line.define('Dictionary', Iterable, {
        properties: {
            /**
             * @property length
             * @type {Number}
             */
            count: {
                get: function () {
                    var length = 0;
                    this.each(function () {
                        length++;
                    });

                    return length;
                }
            },
            /**
             * @property keys
             * @type {Iterable}
             */
            keys: {
                get: function () {
                    return this._keys;
                }
            },
            /**
             * @property values
             * @type {Iterable}
             */
            values: {
                get: function () {
                    return this._values;
                }
            }
        },
        methods: {
            init: function (dict) {
                var map = this._map = {};
                if (dict) {
                    line.each(dict, function (value, key) {
                        map[key] = {
                            key: key.toString(),
                            value: value
                        };
                    });
                }

                this._keys = new KeyIterator(dict);
                this._values = new ValueIterator(dict);
            },
            /**
             * @method contains
             * @param key {String}
             * @returns {Boolean}
             */
            contains: function (key) {
                return key in this._map;
            },
            /**
             * @method getItem
             * @param key {String}
             * @returns {*}
             */
            getItem: function (key) {
                var item = this._map[key];
                return item && item.value;
            },
            /**
             * @method setItem
             * @param key {String}
             * @param value {any}
             */
            setItem: function (key, value) {
                var item = this._map[key];
                if (!item) {
                    item = this._map[key] = {
                        key: key
                    };
                }

                item.value = value;
            },
            /**
             * @method removeItem
             * @param key {String}
             */
            removeItem: function (key) {
                delete this._map[key];
            },
            /**
             * @method clear
             */
            clear: function () {
                this._map = {};
            },
            /**
             * @method each
             * @param callback {Function}
             * @param [context] {Object}
             */
            each: function (callback, context) {
                line.each(this._map, callback, context);
            },
            /**
             * @method toArray
             * @returns {Array}
             */
            toArray: function () {
                var result = [];
                this.each(function (item) {
                    result.push(item);
                });

                return result;
            },
            /**
             * @method toObject
             * @returns {Object}
             */
            toObject: function () {
                var result = {};
                this.each(function (item) {
                    result[item.key] = item.value;
                });

                return result;
            }
        }
    });

});