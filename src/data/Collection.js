line.module([
    '../core/Iterable'
], function (Iterable) {

    var ArrayPrototype = Array.prototype;
    var push = ArrayPrototype.push;
    var sort = ArrayPrototype.sort;
    var slice = ArrayPrototype.slice;
    var splice = ArrayPrototype.splice;
    var indexOf = ArrayPrototype.indexOf;
    var lastIndexOf = ArrayPrototype.lastIndexOf;
    var forEach = ArrayPrototype.forEach;

    /**
     * @class Collection
     * @extends line.Iterable
     * @constructor
     * @param iter
     */
    return line.define('Collection', Iterable, {
        properties: {
            /**
             * @property count
             * @type {Number}
             */
            count: {
                get: function () {
                    return this.length;
                }
            }
        },
        methods: {
            init: function (iter) {
                this.length = 0;
                if (iter) {
                    splice.apply(this, [0, 0].concat(Iterable.toArray(iter)));
                }
            },
            dispose: function () {
                this.base();
                this.clear();
            },
            /**
             * Add an item.
             * @method add
             * @param item
             */
            add: function (item) {
                var index = this.length;
                push.call(this, item);
                return index;
            },
            /**
             * Add multiple items.
             * @method addRange
             * @param iter
             * @returns {*}
             */
            addRange: function (iter) {
                var index = this.length;
                splice.apply(this, [this.length, 0].concat(Iterable.toArray(iter)));
                return index;
            },
            /**
             * @method remove
             * @param item
             * @returns {*}
             */
            remove: function (item) {
                var index = this.indexOf(item);
                if (index >= 0) {
                    splice.call(this, index, 1);
                    return index;
                }
                else {
                    return -1;
                }
            },
            /**
             * @method removeAt
             * @param index
             * @returns {*}
             */
            removeAt: function (index) {
                return splice.call(this, index, 1)[0];
            },
            /**
             * @method insert
             * @param item
             * @param index
             */
            insert: function (item, index) {
                splice.call(this, index, 0, item);
                return index;
            },
            /**
             * @method insertRange
             * @param index
             * @param iter
             * @returns {*}
             */
            insertRange: function (iter, index) {
                splice.apply(this, [index, 0].concat(Iterable.toArray(iter)));
                return index;
            },
            /**
             * @method clear
             * @returns {*}
             */
            clear: function () {
                return splice.call(this, 0);
            },
            /**
             * @method getItem
             * @param index
             * @returns {*}
             */
            getItem: function (index) {
                if (index < this.length) {
                    return this[index];
                }
                else {
                    throw new Error('Index out of range.');
                }
            },
            /**
             * @method setItem
             * @param index
             * @param item
             * @returns {*}
             */
            setItem: function (index, item) {
                if (index < this.length) {
                    this[index] = item;
                }
                else {
                    throw new Error('Index out of range.');
                }
            },
            /**
             * @method getRange
             * @param index
             * @param count
             * @returns {*}
             */
            getRange: function (index, count) {
                return new Collection(slice.call(this, index, index + count));
            },
            /**
             * @method indexOf
             * @param item
             * @param from
             * @returns {*}
             */
            indexOf: function (item, from) {
                return indexOf.call(this, item, from);
            },
            /**
             * @method lastIndexOf
             * @param item
             * @param from
             * @returns {*}
             */
            lastIndexOf: function (item, from) {
                return lastIndexOf.call(this, item, from);
            },
            /**
             * @method contains
             * @param item
             * @returns {boolean}
             */
            contains: function (item) {
                return this.indexOf(item) >= 0;
            },
            /**
             * @method sort
             * @param comp
             * @returns {Array}
             */
            sort: function (comp) {
                return sort.call(this, comp);
            },
            /**
             * @method each
             * @param callback
             * @param context
             */
            each: function (callback, context) {
                forEach.call(this, callback, context);
            },
            /**
             * @method  toArray
             * @returns {Array}
             */
            toArray: function () {
                return slice.call(this, 0);
            },
            __index__: function (item, from, reverse) {
                return reverse ? this.indexOf(item, from) : this.lastIndexOf(item, from);
            }
        }
    });

});