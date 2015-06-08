line.module(function () {

    /**
     * @module core
     * @class Observable
     */
    var Observable = line.define('Observable', {
        methods: {
            /**
             * @constructor
             */
            init: function () {
                this.__watchers__ = {};
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
                if (member) {
                    if (member.get) {
                        return member.get.call(this, options);
                    }
                    else if (member.execute) {
                        return member.execute.bind(this);
                    }
                }
            },
            /**
             * Dispose current object.
             * @method dispose
             */
            dispose: function () {
                this.base();
                line.each(this.__watchers__, function (watchers, name) {
                    this._unbind(name, this.get(name));
                }, this);
                this.__watchers__ = {};
            },
            /**
             * @method
             * @param path
             * @param handler
             * @param context
             */
            watch: function (path, handler, context) {
                line.each(path === '*' ? this.constructor.__properties__ : (line.is(path, 'array') ? path : [path]), function (p) {
                    this._watch(p, handler, context);
                }, this);
            },
            /**
             * @method unwatch
             * @param path
             * @param handler
             * @param context
             */
            unwatch: function (path, handler, context) {
                line.each(path === '*' ? this.constructor.__properties__ : (line.is(path, 'array') ? path : [path]), function (p) {
                    this._unwatch(p, handler, context);
                }, this);
            },
            /**
             * @method notify
             * @param name
             */
            notify: function (name) {
                if (name === '*') {
                    line.each(this.__watchers__, function (n) {
                        this._notify(n);
                    }, this);
                }
                else {
                    line.each(line.is(name, 'array') ? name : [name], function (n) {
                        this._notify(n);
                    }, this);
                }

            },
            _watch: function (path, handler, context) {
                var index = path.indexOf('.');
                var name = path;
                var subPath = '';
                if (index >= 0) {
                    name = path.slice(0, index);
                    subPath = path.slice(index + 1);
                    var sub = this.get(name);
                    if (sub && sub.watch) {
                        sub.watch(subPath, handler, context);
                    }
                }

                var map = this.__watchers__;
                var watchers = map[name] = map[name] || [];

                watchers.push({
                    handler: handler,
                    context: context,
                    fullPath: path,
                    subPath: subPath
                });

                var prop = this.member(name);
                if (prop && prop.type === 'property') {
                    var meta = prop.meta;
                    if (!meta.watched) {
                        var getter = prop.get;
                        var setter = prop.set;
                        Observable.defineProperty(name, {
                            get: function (options) {
                                return getter.call(this, options);
                            },
                            set: function (value, options) {
                                var oldValue = getter.call(this);
                                if (oldValue !== value || (options && options.force)) {
                                    this._unbind(name, oldValue);
                                    if (setter.call(this, value, options) !== false) {
                                        this._bind(name, value);
                                        this.notify(name);
                                    }
                                }
                            },
                            watched: true
                        }, this);
                    }
                }
            },
            _unwatch: function (path, handler, context) {
                var index = path.indexOf('.');
                var name = path;
                if (index >= 0) {
                    name = path.slice(0, index);
                    var sub = this.get(name);
                    if (sub && sub.unwatch) {
                        sub.unwatch(path.slice(index + 1), handler, context);
                    }
                }

                var map = this.__watchers__;
                var watchers = map[name], watcher;

                if (watchers) {
                    if (handler) {
                        for (var i = 0, length = watchers.length; i < length; i++) {
                            watcher = watchers[i];
                            if (watcher.handler === handler && watcher.context === context) {
                                watchers.splice(i, 1);
                                break;
                            }
                        }
                    }
                    else {
                        watchers.length = 0;
                    }
                }
            },
            _notify: function (name) {
                var value = this.get(name);
                line.each(this.__watchers__[name], function (watcher) {
                    if (watcher && watcher.handler) {
                        watcher.handler.call(watcher.context, line.path(value, watcher.subPath), watcher.fullPath, this);
                    }
                }, this);
            },
            _bind: function (name, value) {
                if (value && value.watch) {
                    line.each(this.__watchers__[name], function (watcher) {
                        if (watcher.subPath) {
                            value.watch(watcher.subPath, watcher.handler, watcher.context);
                        }
                    });
                }
            },
            _unbind: function (name, value) {
                if (value && value.unwatch) {
                    line.each(this.__watchers__[name], function (watcher) {
                        if (watcher.subPath) {
                            value.unwatch(watcher.subPath, watcher.handler, watcher.context);
                        }
                    });
                }
            }
        }
    });

    return Observable;

});
