line.module(function () {

    /**
     * @module core
     * @class Iterable
     */
    var Iterable = line.define('Iterable', {
        statics: {
            /**
             * Convert the iterable object to an array.
             * @method toArray
             * @static
             * @param iter {Object|Array|line.Iterable}
             * @returns {Array}
             */
            toArray: function (iter) {
                if (line.is(iter, Iterable)) {
                    return iter.toArray();
                }
                else if (line.is(iter, 'array')) {
                    return iter.slice(0);
                }
                else {
                    var result = [];
                    line.each(iter, function (item) {
                        result.push(item);
                    });

                    return result;
                }
            }
        },
        methods: {
            /**
             * @method each
             * @param callback
             * @param context
             */
            each: function (callback, context) {
                throw new Error('Not Implemented.');
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
            __each__: function (callback, context) {
                return this.each(callback, context);
            }
        }
    });

    return Iterable;

});