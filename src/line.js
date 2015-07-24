/**
 * Make the "line" object available across modules.
 * @module line
 * @class line
 * @static
 */
line = {
    VERSION: '0.1.0',
    DEBUG: false,
    PATH: '',
    BREAK: {},
    GLOBAL: (function () {
        return this;
    }).call(null)
};

/**
 * Builtin Functions
 */
(function (line) {

    var toString = Object.prototype.toString;
    var indexOf = Array.prototype.indexOf;
    var lastIndexOf = Array.prototype.lastIndexOf;
    var BREAK = line.BREAK;

    /**
     * Extend target with properties from sources.
     * @method extend
     * @param target {Object} The target object to be extended.
     * @param source* {Object} The source objects.
     * @returns {Object}
     */
    line.extend = function (target) {
        for (var i = 1, length = arguments.length; i < length; i++) {
            var arg = arguments[i];
            for (var key in arg) {
                if (arg.hasOwnProperty(key)) {
                    target[key] = arg[key];
                }
            }
        }

        return target;
    };

    /**
     * Iterate over target and execute the callback with context.
     * @method each
     * @param target {Object|Array|Iterable} The target object to be iterate over.
     * @param callback {Function} The callback function to execute, return false to stop the iteration.
     * @param context {Object} The context object which act as 'this'.
     */
    line.each = function (target, callback, context) {
        if (target && callback) {
            if (target.__type__ && target.__each__) {
                target.__each__(callback, context);
            }
            else {
                var length = target.length;
                if (length >= 0) {
                    for (var i = 0; i < length; i++) {
                        if (callback.call(context, target[i], i) === BREAK) {
                            return BREAK;
                        }
                    }
                }
                else {
                    for (var key in target) {
                        if (target.hasOwnProperty(key)) {
                            if (callback.call(context, target[key], key) === BREAK) {
                                return BREAK;
                            }
                        }
                    }
                }
            }
        }
    };

    /**
     *
     * @param target {Object|Array|Iterable} The target object in which to find item.
     * @param item {*} The item to find.
     * @param [from] {Number} The index to search from.
     * @param [reverse] {Boolean} Reverse search.
     * @returns {Number} The result.
     */
    line.index = function (target, item, from, reverse) {
        if (target) {
            if (target.__index__) {
                return target.__index(item, from, reverse);
            }
            else {
                return reverse ? indexOf.call(target, item, from) : lastIndexOf(target, item, from);
            }
        }
    };

    /**
     * Shallow clone target object.
     * @method clone
     * @param target {Object|Array} The target object to be cloned.
     * @returns {Object} The cloned object.
     */
    line.clone = function (target) {
        if (target) {
            if (target.__clone__) {
                return target.__clone__();
            }
            else {
                if (line.is(target, 'array')) {
                    return target.slice(0);
                }
                else {
                    var result = {};
                    for (var key in target) {
                        if (target.hasOwnProperty(key)) {
                            result[key] = target[key];
                        }
                    }

                    return result;
                }
            }
        }
        else {
            return target;
        }
    };

    /**
     * Get a string representing the type of target
     * @param target
     * @returns {*}
     */
    line.type = function (target) {
        if (target && target.__type__) {
            return target.__type__;
        }
        else {
            return toString.call(target).slice(8, -1).toLowerCase();
        }
    };

    /**
     * Check whether target is specified type.
     * @method is
     * @param target {Object} The target object to be checked.
     * @param type {String|Function} The type could either be a string or a class object.
     * @returns {Boolean}
     */
    line.is = function (target, type) {
        if (target && target.__is__) {
            return target.__is__(type);
        }
        else {
            if (typeof type === 'string') {
                type = type.toLowerCase();
                switch (type) {
                    case 'undefined':
                        return target === undefined;
                    case 'null':
                        return target === null;
                    case 'object':
                        return target && (typeof target === 'object');
                    case 'plain':
                        return target && target.constructor === Object;
                    case 'string':
                    case 'boolean':
                    case 'number':
                    case 'function':
                        return typeof target === type;
                    case 'array':
                        return Array.isArray(target);
                    default:
                        return toString.call(target).slice(8, -1).toLowerCase() === type;
                }
            }
            else if (typeof type === 'function') {
                return target instanceof type;
            }
        }
    };

    /**
     * Check whether target has specified event.
     * @method may
     * @param target {Object} The target object.
     * @param name {String} The property name.
     * @returns {Boolean}
     */
    line.may = function (target, name) {
        if (target && name) {
            if (target.__may__) {
                return target.__may__(name);
            }
            else {
                return target.hasOwnProperty('on' + name.toLowerCase());
            }
        }
        else {
            return false;
        }
    };

    /**
     * Check whether target has specified method.
     * @method can
     * @param target {Object} The target object.
     * @param name {String} The property name.
     * @returns {Boolean}
     */
    line.can = function (target, name) {
        if (target) {
            if (target.__can__) {
                return target.__can__(name);
            }
            else {
                return typeof target[name] === 'function';
            }
        }
        else {
            return false;
        }
    };

    /**
     * Check whether target has specified property.
     * @method has
     * @param target {Object} The target object.
     * @param name {String} The property name.
     * @returns {Boolean}
     */
    line.has = function (target, name) {
        if (target) {
            if (target.__has__) {
                return target.__has__(name);
            }
            else {
                return target.hasOwnProperty(name);
            }
        }
        else {
            return false;
        }
    };

    /**
     * Get the specified property value of target.
     * @method get
     * @param target {Object} The target object.
     * @param name {String} The property name.
     * @returns {*} The value.
     */
    line.get = function (target, name) {
        if (target) {
            if (target.__get__) {
                return target.__get__(name);
            }
            else {
                return target[name];
            }
        }
    };

    /**
     * Set the specified property of target with value.
     * @method set
     * @param target {Object} The target object.
     * @param name {String} The property name.
     * @param value {*} The value to be set.
     */
    line.set = function (target, name, value) {
        if (target) {
            if (target.__set__) {
                target.__set__(name);
            }
            else {
                target[name] = value;
            }
        }
    };

    /**
     * Get all properties of target.
     * @method gets
     * @param target {Object} The target Object.
     * @returns {Object} An object contains all keys and values of target.
     */
    line.gets = function (target) {
        if (target) {
            if (target.__gets__) {
                return target.__gets__();
            }
            else {
                var result = {};
                for (var key in target) {
                    if (target.hasOwnProperty(key)) {
                        result[key] = target[key];
                    }
                }
                return result;
            }
        }
    };

    /**
     * Set a bunch of properties for target.
     * @method sets
     * @param target {Object} The target object.
     * @param dict {Object} An object contains all keys and values to be set.
     */
    line.sets = function (target, dict) {
        if (target && dict) {
            if (target.__sets__) {
                target.__sets__(dict);
            }
            else {
                for (var key in dict) {
                    if (dict.hasOwnProperty(key)) {
                        target[key] = dict[key];
                    }
                }
            }
        }
    };

    /**
     * Compare target and source.
     * @method compare
     * @param target {Object} The target object.
     * @param source {Object} The source object.
     * @returns {Number} The result could be -1,0,1 which indicates the comparison result.
     */
    line.compare = function (target, source) {
        if (target && target.__compare__) {
            return target.__compare__(source);
        }
        else {
            if (typeof target === 'string') {
                return target.localeCompare(source);
            }
            else if (target === source) {
                return 0;
            }
            else if (target > source) {
                return 1;
            }
            else if (target < source) {
                return -1;
            }
            else {
                return 1;
            }
        }
    };

    /**
     * Get value from target specified by a path and optionally set a value for it.
     * @method path
     * @param target {Object} The target object.
     * @param path {String} The path.
     * @param [value] {*} The value to be set.
     * @returns {*}
     */
    line.path = function (target, path, value) {
        var result = target;
        if (path) {
            var tokens = path.split('.'), token,
                i = 0, length = tokens.length;

            if (arguments.length < 3) {
                for (; result && i < length; i++) {
                    token = tokens[i];
                    if (result.__get__) {
                        result = result.__get__(token);
                    }
                    else {
                        result = result[token];
                    }
                }
            }
            else {
                length -= 1;
                for (; result && i < length; i++) {
                    token = tokens[i];
                    if (result.__get__) {
                        result = result.__get__(token);
                    }
                    else {
                        result = result[token] = result[token] || {};
                    }
                }

                token = tokens[i];
                if (result) {
                    if (result.__set__) {
                        result.__set__(token, value);
                    }
                    else {
                        result[token] = value;
                    }

                    result = value;
                }
            }
        }

        return result;
    };

    /**
     * Invoke the method specified by th path.
     * @param target {Object} The target object.
     * @param path {String} The path.
     * @param [args] {Array} The arguments.
     */
    line.invoke = function (target, path, args) {
        if (target && path) {
            var index = path.lastIndexOf('.');
            var context, method;

            if (index > 0) {
                context = line.path(target, path.substring(0, index));
                if (context) {
                    method = context[path.substring(index + 1)];
                }
            }
            else {
                context = target;
                method = target[path];
            }

            if (method) {
                return method.apply(context, args);
            }
        }
    };

    /**
     * Empty function which may be useful for some callbacks.
     */
    line.noop = function () {
        // noop
    };

})(line);

/**
 * Class Mechanism
 */
(function (line) {

    var MEMBER_PREFIX = '@',
        id = 1,
        GLOBAL = line.GLOBAL;

    /**
     * Define an event for target
     * @param target
     * @param name
     * @param meta
     * @returns {boolean}
     */
    function defineEvent(target, name, meta) {
        var key = MEMBER_PREFIX + name;
        var overridden = key in target;
        var add, remove;

        target[key] = {
            name: name,
            type: 'event',
            meta: meta,
            add: meta.add || function (handler, options) {
                var listeners = this.__listeners__[name];
                if (!listeners) {
                    listeners = this.__listeners__[name] = [null];
                }

                listeners.push({
                    handler: handler,
                    options: options,
                    owner: this
                });

            },
            remove: meta.remove || function (handler, options) {
                var listeners = this.__listeners__[name];
                if (listeners) {
                    if (handler) {
                        for (var i = listeners.length - 1; i > 0; i--) {
                            var listener = listeners[i];
                            if (listener.handler === handler) {
                                listeners.splice(i, 1);
                            }
                        }
                    }
                    else {
                        listeners.length = 1;
                    }
                }
            },
            fire: function (data, options) {
                var listeners = this.__listeners__[name];
                if (listeners) {
                    for (var i = 0, length = listeners.length; i < length; i++) {
                        var listener = listeners[i];
                        if (listener && listener.handler) {
                            if (false === listener.handler.call(listener.owner, data, options)) {
                                return false;
                            }
                        }
                    }
                }
            },
            descriptor: Object.defineProperty(target, 'on' + name.toLowerCase(), {
                get: function () {
                    var listeners = this.__listeners__[name];
                    if (listeners) {
                        return listeners[0].handler;
                    }
                    else {
                        return null;
                    }
                },
                set: function (value) {
                    var map = this.__listeners__;
                    var listeners = map[name];
                    if (!listeners) {
                        listeners = map[name] = [];
                    }

                    listeners[0] = {
                        handler: value,
                        options: null,
                        owner: this
                    };
                }
            })
        };

        return overridden;
    }

    /**
     * Define a property for target
     * @param target
     * @param name
     * @param meta
     * @returns {boolean}
     */
    function defineProperty(target, name, meta) {
        var key = MEMBER_PREFIX + name;
        var overridden = key in target;
        var getter, setter;

        if ('value' in meta) {
            var value = meta.value;
            var field = '_' + name;
            getter = function (options) {
                if (field in this) {
                    return this[field];
                }
                else {
                    return line.is(value, 'function') ? value.call(this) : value;
                }
            };
            setter = meta.readonly ?
                function (value, options) {
                    if (options && options.force) {
                        this[field] = value;
                    }
                    else {
                        return false;
                    }
                } :
                function (value) {
                    this[field] = value;
                };
        }
        else {
            getter = meta.get || line.noop;
            setter = meta.set || line.noop;
        }

        if (overridden) {
            getter.__base__ = target[key].get;
            setter.__base__ = target[key].set;
        }

        target[key] = {
            name: name,
            type: 'property',
            meta: meta,
            get: getter,
            set: setter,
            descriptor: Object.defineProperty(target, name, {
                get: getter,
                set: setter,
                configurable: true
            })
        };

        return overridden;
    }

    /**
     * Define a method for target
     * @param target
     * @param name
     * @param meta
     * @returns {boolean}
     */
    function defineMethod(target, name, meta) {
        var key = MEMBER_PREFIX + name;
        var overridden = key in target;
        var method = meta.method;

        target[key] = {
            name: name,
            type: 'method',
            meta: meta,
            execute: method
        };

        if (name in target) {
            method.__base__ = target[name];
        }

        target[name] = method;

        return overridden;
    }

    var sharedMethods = {
        /**
         * Get specified member.
         * @param name
         * @returns {*}
         */
        member: function (name) {
            return this[MEMBER_PREFIX + name];
        },
        /**
         * Check whether current object has specified event.
         * @method may
         * @param name {String}
         * @returns {Boolean}
         */
        may: function (name) {
            var member = this.member(name);
            return member && member.type === 'event';
        },
        /**
         * Check whether current object has specified property.
         * @method has
         * @param name {String}
         * @returns {Boolean}
         */
        has: function (name) {
            var member = this.member(name);
            return member && member.type === 'property';
        },
        /**
         * Check whether current object has specified method.
         * @method can
         * @param name {String}
         * @returns {Boolean}
         */
        can: function (name) {
            var member = this.member(name);
            return member && member.type === 'method';
        },
        /**
         * Get specified property value.
         * @method get
         * @param name {String}
         * @param [options] {Any}
         * @returns {*}
         */
        get: function (name, options) {
            var member = this.member(name);
            if (member && member.get) {
                return member.get.call(this, options);
            }
        },
        /**
         * Set specified property value.
         * @method set
         * @param name {String}
         * @param value {*}
         * @param [options] {Any}
         */
        set: function (name, value, options) {
            var member = this.member(name);
            if (member && member.set) {
                member.set.call(this, value, options);
            }

            return this;
        },
        /**
         * Get all properties.
         * @method gets
         * @returns {Object}
         * @param [options] {Any}
         */
        gets: function (options) {
            var result = {};
            line.each(this.constructor.__properties__, function (name) {
                result[name] = this.get(name, options);
            }, this);

            return result;
        },
        /**
         * Set a bunch of properties.
         * @method sets
         * @param obj {Object}
         * @param [options] {Any}
         */
        sets: function (obj, options) {
            if (obj) {
                for (var name in obj) {
                    if (obj.hasOwnProperty(name)) {
                        this.set(name, obj[name], options);
                    }
                }
            }

            return this;
        },
        /**
         * Add an event handler.
         * @method on
         * @param name {String}
         * @param handler {Function}
         * @param [options] {Object}
         */
        on: function (name, handler, options) {
            var member = this.member(name);
            if (member && member.add) {
                member.add.call(this, handler, options);
            }

            return this;
        },
        /**
         * Remove an event handler.
         * @method off
         * @param name {String}
         * @param [handler] {Function}
         * @param [options] {Object}
         */
        off: function (name, handler, options) {
            var member = this.member(name);
            if (member && member.remove) {
                member.remove.call(this, handler, options);
            }

            return this;
        },
        /**
         * Trigger an event.
         * @method fire
         * @param name {String}
         * @param [data] {*}
         * @param [options] {Object}
         */
        fire: function (name, data, options) {
            var member = this.member(name);
            if (member && member.fire) {
                member.fire.call(this, data, options);
            }

            return this;
        },
        __may__: function (name) {
            return this.may(name);
        },
        __can__: function (name) {
            return this.can(name);
        },
        __has__: function (name) {
            return this.has(name);
        },
        __get__: function (name) {
            return this.get(name);
        },
        __set__: function (name, value) {
            this.set(name, value);
        },
        __gets__: function () {
            return this.gets();
        },
        __sets__: function (dict) {
            this.sets(dict);
        }
    };

    var classMethods = {
        /**
         * Get the meta data of the class.
         * @param name
         * @returns {*}
         */
        getMeta: function (name) {
            var target = this;
            var meta;

            while (target) {
                meta = target.__meta__;

                if (name in meta) {
                    return meta[name];
                }
                else {
                    target = target.__base__;
                }
            }
        },
        /**
         * Get the meta data of the class.
         * @param name
         * @param value
         * @returns {*}
         */
        setMeta: function (name, value) {
            this.__meta__[name] = value;
            return this;
        },
        /**
         * Define an event.
         * @method defineEvent
         * @static
         * @param name {String}
         * @param [meta] {Object}
         * @param [target] {Object}
         */
        defineEvent: function (name, meta, target) {
            if (!defineEvent(target || this.prototype, name, meta)) {
                this.__events__.push(name);
            }

            return this;
        },
        /**
         * Define a property.
         * @method defineProperty
         * @static
         * @param name {String}
         * @param [meta] {Object}
         * @param [target] {Object}
         */
        defineProperty: function (name, meta, target) {
            if (!defineProperty(target || this.prototype, name, meta)) {
                this.__properties__.push(name);
            }

            return this;
        },
        /**
         * Define a method.
         * @method defineMethod
         * @static
         * @param name {String}
         * @param meta {Object}
         * @param [target] {Object}
         */
        defineMethod: function (name, meta, target) {
            if (!defineMethod(target || this.prototype, name, meta)) {
                this.__methods__.push(name);
            }

            return this;
        }
    };

    var instanceMethods = {
        /**
         * Dispose current instance.
         * @method dispose
         */
        dispose: function () {
            this.__listeners__ = {};
        },
        /**
         * Destroy current instance.
         * @method destroy
         */
        destroy: function () {
            this.dispose();
        },
        /**
         * Call overridden method from base class
         * @method base
         */
        base: function () {
            var baseMethod = this.base.caller.__base__;
            if (baseMethod) {
                return baseMethod.apply(this, arguments);
            }
        },
        /**
         * Check whether current instance is specified type.
         * @method is
         * @param type {String|Function}
         * @returns {Boolean}
         */
        is: function (type) {
            if (typeof type === 'function') {
                if (this instanceof type) {
                    return true;
                }
                else {
                    var mixins = this.constructor.__mixins__;
                    for (var i = 0, len = mixins.length; i < len; i++) {
                        var mixin = mixins[i];
                        if (type === mixin) {
                            return true;
                        }
                    }
                }
            }
            else {
                return false;
            }
        },
        __is__: function (type) {
            return this.is(type);
        }
    };

    /**
     * The default base class for all classes defined in LineJS.
     * @private
     */
    function __Object__() {
    }

    line.extend(__Object__, sharedMethods, classMethods, {
        __id__: 0,
        __statics__: {},
        __events__: [],
        __properties__: [],
        __methods__: [],
        __mixins__: [],
        __meta__: {}
    });

    line.extend(__Object__.prototype, sharedMethods, instanceMethods);

    /**
     * Define a class
     * @method define
     * @param [name] {String}
     * @param [base] {Function}
     * @param meta {Object}
     * @returns {Function}
     */
    line.define = function () {
        var args = arguments;
        var nArgs = args.length;
        var arg0 = args[0];
        var name, base, meta;

        if (nArgs === 3) {
            name = arg0;
            base = args[1];
            meta = args[2];

            if (!line.is(base, 'function')) {
                throw new Error('Invalid base class.');
            }
        }
        else if (nArgs === 2) {
            if (line.is(arg0, 'string')) {
                name = arg0;
                base = null;
            }
            else if (line.is(arg0, 'function')) {
                name = null;
                base = arg0;
            }
            else {
                throw new Error('Invalid base class.');
            }
            meta = args[1];
        }
        else if (nArgs === 1) {
            name = null;
            base = null;
            meta = arg0;
            if (!line.is(meta, 'object')) {
                throw new Error('The meta argument must be an object.');
            }
        }
        else {
            throw new Error('Invalid arguments.');
        }

        meta = meta || {};
        base = base || __Object__;

        var isStatic = meta.static || false;
        var isPartial = meta.partial || false;
        var isAbstract = meta.abstract || false;
        var isFinal = meta.final || false;
        var mixins = meta.mixins || [];
        var statics = meta.statics || {};
        var events = meta.events || [];
        var props = meta.properties || {};
        var methods = meta.methods || {};
        var prototype;
        var Class, BaseClass;

        if (base.__static__) {
            throw new Error('Static class cannot be inherited.');
        }

        if (base.__final__) {
            throw new Error('Final class cannot be inherited.');
        }

        if (name && isPartial) {
            Class = line.path(GLOBAL, name);
        }

        if (isStatic) {
            if (Class) {
                if (!Class.__static__) {
                    throw new Error('Partial class "' + name + '" must be static.');
                }
            }
            else {
                Class = function () {
                    throw new Error('Cannot instantiate static class.');
                };
            }

            prototype = Class.prototype;
        }
        else {
            if (Class) {
                if (Class.__static__) {
                    throw new Error('Partial class "' + name + '" must not be static.');
                }

                if (Class.__base__ !== base && Class.__base__ !== __Object__) {
                    throw new Error('Partial class "' + name + '" must have consistent base class.');
                }
            }
            else {
                Class = isAbstract ?
                    function () {
                        throw new Error('Cannot instantiate abstract class.');
                    } :
                    function () {
                        var self = this;
                        var mixins = Class.__mixins__;
                        self.__id__ = id++;
                        self.__listeners__ = {};
                        self.__initializing__ = true;

                        for (var i = 0, length = mixins.length; i < length; i++) {
                            var ctor = mixins[i].prototype.__ctor__;
                            if (ctor) {
                                ctor.call(this);
                            }
                        }

                        if (this.__ctor__) {
                            this.__ctor__.apply(this, arguments);
                        }

                        self.__initializing__ = false;
                    };
            }

            if (Class.__base__ !== base) {
                BaseClass = function () {
                };

                BaseClass.prototype = base.prototype;
                prototype = new BaseClass();
                prototype.constructor = Class;
                prototype.__type__ = name;

                Class.prototype = prototype;
            }
            else {
                prototype = Class.prototype;
            }

            if (methods.init) {
                prototype.__ctor__ = methods.init;
            }
        }

        line.extend(Class, sharedMethods, classMethods, {
            __id__: id++,
            __name__: name,
            __base__: base,
            __partial__: isPartial,
            __abstract__: isAbstract,
            __static__: isStatic,
            __final__: isFinal,
            __statics__: line.extend({}, base.__statics__, statics),
            __events__: base.__events__.slice(0),
            __properties__: base.__properties__.slice(0),
            __methods__: base.__methods__.slice(0),
            __mixins__: base.__mixins__.concat(mixins),
            __meta__: meta,
            toString: function () {
                return '[class ' + (this.__name__ || 'anonymous') + ']';
            }
        });

        line.extend(Class, Class.__statics__);

        if (isStatic) {
            line.each(events, function (item) {
                defineEvent(Class, item, {});
            });

            line.each(props, function (value, key) {
                defineProperty(Class, key, line.is(value, 'object') ? value : {value: value});
            });

            line.each(methods, function (value, key) {
                defineMethod(Class, key, line.is(value, 'function') ? {method: value} : value);
            });

            if (methods.init) {
                methods.init.call(Class);
            }
        }
        else {
            line.each(mixins, function (mixin) {
                var mixinPrototype = mixin.prototype;
                line.each(mixin.__events__, function (name) {
                    Class.defineEvent(name, mixinPrototype.member(name).meta);
                });

                line.each(mixin.__properties__, function (name) {
                    Class.defineProperty(name, mixinPrototype.member(name).meta);
                });

                line.each(mixin.__methods__, function (name) {
                    if (!sharedMethods[name] && !instanceMethods[name]) {
                        Class.defineMethod(name, mixinPrototype.member(name).meta);
                    }
                });
            });

            line.each(events, function (item) {
                Class.defineEvent(item, {});
            });

            line.each(props, function (value, key) {
                Class.defineProperty(key, line.is(value, 'object') ? value : {value: value});
            });

            line.each(methods, function (value, key) {
                Class.defineMethod(key, line.is(value, 'function') ? {method: value} : value);
            });
        }

        if (prototype.__define__) {
            prototype.__define__(Class);
        }

        return Class;
    };

})(line);

/**
 * Module Mechanism
 */
(function (line) {

    var DOT = '.',
        DOUBLE_DOT = '..',
        SLASH = '/',
        STATUS_PENDING = 0,
        STATUS_LOADING = 1,
        STATUS_RESOLVING = 2,
        STATUS_RESOLVED = 3,
        doc = line.GLOBAL.document;

    // The path to line.js
    var libPath = (function () {
        var path = null;

        if (doc) {
            line.each(document.getElementsByTagName('script'), function (el) {
                var src = el.getAttribute('src') || '';
                var index = src.indexOf('line.js');
                if (index >= 0) {
                    path = src.slice(0, index);
                    return line.BREAK;
                }
            });
        }

        if (!path) {
            path = DOT + SLASH;
        }

        return path;
    })();

    // Normalize the path. e.g. "./aa/bb/.././cc" -> "./aa/cc"
    var normalizePath = function (path) {
        var tokens = path.split(SLASH);
        var normalized = [], token, count = 0;

        for (var i = 0, len = tokens.length; i < len; i++) {
            token = tokens[i];
            if (token) {
                if (token === DOUBLE_DOT) {
                    if (count > 0) {
                        count--;
                        normalized.pop();
                    }
                    else {
                        normalized.push(DOUBLE_DOT);
                    }
                }
                else if (token === DOT) {
                    if (i === 0) {
                        normalized.push(DOT);
                    }
                }
                else {
                    count++;
                    normalized.push(token);
                }
            }
            else {
                if (count > 0 && i < len - 1) {
                    normalized = normalized.slice(0, -count);
                }
                else {
                    normalized.push('');
                }
            }
        }

        return normalized.join(SLASH);
    };

    // Get the parent path
    var parentPath = function (path) {
        return path.slice(0, path.lastIndexOf(SLASH) + 1);
    };

    // Get the last path
    var lastPath = function (path) {
        return path.slice(path.lastIndexOf(SLASH) + 1);
    };

    // Append ext to path accordingly
    var appendExt = function (path, ext) {
        var extLength = ext.length;
        var end = path.slice(-extLength);

        if (end === ext) {
            return path;
        }
        else if (end[extLength - 1] === SLASH) {
            return path + 'index' + DOT + ext;
        }
        else {
            return path + DOT + ext;
        }
    };

    // Get the ext of path
    var getExt = function (path) {
        var slashIndex = path.lastIndexOf(SLASH);
        var dotIndex = path.lastIndexOf(DOT);

        if (dotIndex > slashIndex) {
            return path.slice(dotIndex + 1);
        }
        else {
            return '';
        }
    };

    /**
     * Internal Module class
     * @class Module
     * @internal
     */
    var Module = line.Module = line.define({
        statics: {
            all: {},
            current: null
        },
        properties: {
            status: STATUS_PENDING,
            path: '',
            dependencies: null,
            factory: null,
            value: null
        },
        methods: {
            init: function (path, deps, factory) {
                this.sets({
                    path: path,
                    dependencies: deps || [],
                    factory: factory,
                    value: {}
                });

                this._callbacks = [];
            },
            load: function (callback) {
                var status = this.get('status');

                if (status === STATUS_RESOLVED) {
                    if (callback) {
                        callback(this.get('value'));
                    }
                }
                else {
                    if (callback) {
                        this._callbacks.push(callback);
                    }
                }

                if (status === STATUS_LOADING) {
                    var path = this.get('path');
                    var deps = this.get('dependencies');
                    var factory = this.get('factory');
                    var value = this.get('value');
                    var count = deps.length;
                    var params = [];
                    var self = this;

                    this.set('status', STATUS_RESOLVING);

                    if (count === 0) {
                        value = factory.call(value) || value;
                        this.set('value', value);
                        this.set('status', STATUS_RESOLVED);

                        line.each(this._callbacks, function (c) {
                            c(value);
                        });

                        this._callbacks = [];
                    }
                    else {
                        line.each(deps, function (dep, index) {
                            line.load(dep, function (param) {
                                params[index] = param;
                                count--;
                                if (count === 0) {
                                    value = factory.apply(value, params) || value;
                                    self.set('value', value);
                                    self.set('status', STATUS_RESOLVED);

                                    line.each(self._callbacks, function (c) {
                                        c(value);
                                    });

                                    self._callbacks = [];
                                }
                            }, self);
                        });
                    }
                }
            }
        }
    });

    /**
     * Define a module
     * @param deps
     * @param callback
     * @returns {object}
     */
    line.module = function () {
        var args = arguments;
        var nArgs = args.length;
        var arg0 = args[0];
        var deps = [];
        var factory = null;

        if (nArgs === 2) {
            deps = arg0;
            factory = arguments[1];
        }
        else if (nArgs === 1) {
            if (line.is(arg0, 'function')) {
                factory = arg0;
            }
            else if (line.is(arg0, 'array')) {
                deps = arg0;
                factory = function () {
                    var result = {length: arguments.length};
                    line.each(arguments, function (mod, index) {
                        if (mod.__name__) {
                            result[mod.__name__] = mod;
                        }

                        result[index] = mod;
                    });

                    return result;
                };
            }
            else {
                factory = function () {
                    return arg0;
                };
            }
        }
        else {
            throw new Error('Invalid arguments.');
        }

        Module.current = new Module('', deps, factory);

        return Module.current;
    };

    /**
     * load a module
     */
    line.load = function (path, callback, owner) {
        if (line.is(path, Module)) {
            path.load(callback);
        }
        else if (line.is(path, 'string')) {
            var currentPath = path,
                currentModule,
                result = {},
                ownerPath,
                ext = getExt(path),
                scheme = null;

            // If PATH does not have a value, assign the first loaded module path to it
            if (!line.PATH) {
                line.PATH = parentPath(path) || (DOT + SLASH);
                currentPath = lastPath(path);
            }

            // Check ext to determine the scheme
            switch (ext) {
                case 'css':
                case 'json':
                    scheme = ext;
                    break;
                default:
                    break;
            }

            if (path.indexOf('node:') === 0) {
                scheme = 'node';
                currentPath = path.slice(5);
            }
            else {
                // If original path does not contain a SLASH, it should be the library path
                if (!ext && path.indexOf(SLASH) < 0) {
                    currentPath = libPath + path + SLASH;
                }
                else {
                    ownerPath = owner ? parentPath(owner.get('path')) : line.PATH;
                    currentPath = normalizePath(ownerPath + currentPath);
                }
            }

            currentModule = Module.all[currentPath];

            if (currentModule) {
                return currentModule.load(callback);
            }
            else {
                currentModule = Module.all[currentPath] = new Module(currentPath);
                if (doc) { // Browser Environment
                    var head = doc.head || doc.getElementsByTagName('head')[0];

                    if (!scheme) {
                        var scriptNode = doc.createElement('script');
                        var handler = function (err) {
                            scriptNode.onload = null;
                            scriptNode.onerror = null;

                            if (err) {
                                throw new Error('Failed to load module:' + currentPath);
                            }
                            else {
                                currentModule.sets({
                                    path: currentPath,
                                    dependencies: Module.current.get('dependencies'),
                                    factory: Module.current.get('factory'),
                                    status: STATUS_LOADING
                                });
                                currentModule.load(callback);
                            }
                        };

                        scriptNode.src = appendExt(currentPath, 'js');
                        scriptNode.async = true;
                        head.appendChild(scriptNode);

                        if ('onload' in scriptNode) {
                            scriptNode.onload = function () {
                                handler(null);
                            };
                        }
                        else {
                            scriptNode.onreadystatechange = function (e) {
                                var state = scriptNode.readyState;
                                if (state === 'loaded' || state === 'complete') {
                                    handler(null);
                                }
                                else {
                                    handler(e);
                                }
                            };
                        }

                        scriptNode.onerror = function (e) {
                            handler(e);
                        };
                    }
                    else if (scheme === 'css') {
                        var linkNode = doc.createElement('link');
                        linkNode.rel = 'stylesheet';
                        linkNode.href = appendExt(currentPath, 'css');
                        head.appendChild(linkNode);

                        currentModule.sets({
                            value: linkNode,
                            path: currentPath,
                            dependencies: Module.current.get('dependencies'),
                            factory: Module.current.get('factory'),
                            status: STATUS_RESOLVED
                        });
                        currentModule.load(callback);

                    }
                    else {
                        throw new Error('The scheme ' + scheme + ' is not supported.');
                    }
                }
                else { // NodeJS environment
                    if (!scheme) {
                        require(currentPath);
                        currentModule.sets({
                            path: currentPath,
                            dependencies: Module.current.get('dependencies'),
                            factory: Module.current.get('factory'),
                            status: STATUS_LOADING
                        });
                        currentModule.load(callback);
                    }
                    else if (scheme === 'node') {
                        result = require(currentPath);
                        currentModule.sets({
                            value: result,
                            path: currentPath,
                            dependencies: Module.current.get('dependencies'),
                            factory: Module.current.get('factory'),
                            status: STATUS_LOADING
                        });
                        currentModule.load(callback);
                    }
                    else {
                        throw new Error('The scheme ' + scheme + ' is not supported.');
                    }
                }
            }
        }
    };

})(line);

/**
 * Export the "line" object
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = line;
}
