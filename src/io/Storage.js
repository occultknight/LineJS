(function (line) {
    line.define('line.io.Storage', {
        abstract: true,
        events: ['load', 'change', 'error'],
        methods: {
            init: function () {
                this._nodeMap = {};
                this._isReady = true;
                this._readyCallbacks = [];
            },
            ready: function (callback) {
                if (this._isReady) {
                    callback();
                }
                else {
                    this._readyCallbacks.push(callback);
                }
            },
            createDataNode: function (paths) {
                var nodeMap = this._nodeMap;
                var path = paths.join('.');
                var node = nodeMap[path];

                if (!node) {
                    node = nodeMap[path] = new line.data.DataNode(paths, this);
                }

                return node;
            },
            read: function (key, callback) {
                throw new Error('Cannot call abstract method.');
            },
            add: function (key, value, callback) {

            },
            update: function (key, value, callback) {
                throw new Error('Cannot call abstract method.');
            },
            remove: function (key, callback) {

            },
            _onReady: function () {
                array.forEach(this._readyCallbacks, function (callback) {
                    callback();
                });
            }
        }
    });

    line.define('line.io.LocalStorage', {

    });

    line.define('line.io.FileStorage', {

    });

    line.define('line.io.RemoteStorage', {

    });

    line.define('line.io.RestStorage', {

    });

    line.define('line.data.MemoryStorage', line.data.LocalStorage, {
        events: ['load', 'change', 'error'],
        methods: {
            init: function (data) {
                this.base();
                this._data = data;
            },
            read: function (paths, query) {
                var i = 0, length = paths.length, path, target = this._data;
                var data = {}, subKeys = [];
                for (; i < length; i++) {
                    path = paths[i];
                    if (line.has(target, path)) {
                        target = target[path];
                    }
                    else {
                        target = undefined;
                        break;
                    }
                }

                if (line.isObject(target)) {
                    line.each(target, function (value, key) {
                        switch (line.getType(value)) {
                            case 'String':
                            case 'Number':
                            case 'Boolean':
                            case 'Null':
                                data[key] = value;
                                break;
                            case 'Array':
                            case 'Object':
                                subKeys.push(key);
                                break;
                        }
                    });
                }
                else {
                    data = target;
                }

                this.fire('load', {
                    paths: paths,
                    data: data,
                    subKeys: subKeys
                });
            },
            write: function (paths, key, action, data) {
                this.fire('change', {
                    paths: paths,
                    key: key,
                    action: action,
                    data: data
                });
            }
        }
    });

    line.define('line.data.WebStorage', line.data.LocalStorage, {
        properties: {
            entry: {
                value: 'linejs',
                readonly: true
            }
        },
        methods: {
            init: function (entry, useSession) {
                this.base();
                var storage = this._storage = line.GLOBAL[useSession ? 'sessionStorage' : 'localStorage'];
                this.entry(entry);
                if (storage) {
                    try {
                        this._data = JSON.parseJSON(storage[entry]);
                    }
                    catch (ex) {
                        this._data = {};
                        storage[entry] = '{}';
                    }

                    var self = this;

                    if (window.addEventListener) {
                        window.addEventListener('storage', function (event) {
                            if (event.key == entry) {
                                self.fire('change', JSON.parseJSON(storage[entry + '_changes']));
                            }
                        });
                    }
                    else {
                        document.attachEvent('onstorage', function (event) {
                            if (event.key == entry) {
                                self.fire('change', JSON.parseJSON(storage[entry + '_changes']));
                            }
                        });
                    }
                }
                else {
                    throw new TypeError('"Storage" is not supported in your environment.');
                }
            },
            read: function (paths, query) {
                var target = this._data = JSON.parseJSON(this._storage[this.entry()]);
                var i = 0, length = paths.length, path;
                var data = {}, subKeys = [];
                for (; i < length; i++) {
                    path = paths[i];
                    if (line.has(target, path)) {
                        target = target[path];
                    }
                    else {
                        target = undefined;
                        break;
                    }
                }

                if (line.isObject(target)) {
                    line.each(target, function (value, key) {
                        switch (line.getType(value)) {
                            case 'String':
                            case 'Number':
                            case 'Boolean':
                            case 'Null':
                                data[key] = value;
                                break;
                            case 'Array':
                            case 'Object':
                                subKeys.push(key);
                                break;
                        }
                    });
                }
                else {
                    data = target;
                }

                this.fire('load', {
                    paths: paths,
                    data: data,
                    subKeys: subKeys
                });
            },
            write: function (paths, key, action, data) {
                var i = 0, length = paths.length, target = this._data, path;
                for (; i < length; i++) {
                    path = paths[i];
                    if (line.has(target, path)) {
                        target = target[path];
                    }
                    else {
                        break;
                    }
                }

                if (target) {
                    switch (action) {
                        case 'add':
                            if (line.isArray(target)) {
                                target.push(data);
                            }
                            else {
                                if (!key) {
                                    key = '' + (+new Date());
                                }
                                target[key] = data;
                            }
                            break;
                        case 'update':
                            target[key] = data;
                            break;
                        case 'remove':
                            if (line.isArray(target)) {
                                target.splice(+key, 1);
                            }
                            else {
                                delete target[key];
                            }
                            break;
                    }
                }

                var changesData = {
                    paths: paths,
                    key: key,
                    action: action,
                    data: data
                };

                this._storage[this.entry() + '_changes'] = JSON.stringify(changesData);
                this._storage[this.entry()] = JSON.stringify(this._data);
                this.fire('change', changesData);
            }
        }
    });

    line.define('line.data.HttpStorage', line.data.Storage, {
        methods: {
            init: function (url) {
            },
            read: function (paths, query) {
            },
            write: function (paths, key, action, data) {
            }
        }
    });

    line.define('line.data.WebSocketStorage', line.data.Storage, {
        methods: {
            init: function (url) {
                if (window.WebSocket) {
                    var socket = this._socket = new WebSocket(url);
                    socket.onopen = bind(this._onOpen, this);
                    socket.onmessage = bind(this._onMessage, this);
                    socket.onerror = bind(this._onError, this);
                }
                else {
                    throw new TypeError('"WebSocket" is not supported.');
                }
            },
            read: function (paths, query) {
                this._socket.send(JSON.stringify({
                    paths: paths,
                    action: 'read',
                    query: query
                }));
            },
            write: function (paths, key, action, data) {
                this._socket.send(JSON.stringify({
                    paths: paths,
                    key: key,
                    action: action,
                    data: data
                }));
            },
            _onOpen: function () {
                this.fire('ready');
            },
            _onMessage: function (e) {
                var message = JSON.parseJSON(e.data);
                var action = message.action;
                if (action == 'load') {
                    this.fire('change', {
                        paths: message.paths,
                        data: message.data,
                        subKeys: message.subKeys
                    });
                }
                else if (message.action == 'change') {
                    this.fire('change', {
                        paths: message.paths,
                        action: action,
                        data: message.data
                    });
                }
            },
            _onError: function (e) {
                this.fire('error', e);
            }
        }
    });

})(line);
