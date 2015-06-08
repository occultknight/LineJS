(function (line, array) {
    var NODE_TYPE = {
        DICT: 'dict',
        LIST: 'list',
        VALUE: 'value',
        EMPTY: 'empty',
        UNKNOWN: 'unknown'
    };

    line.define('line.data.DataNode', null, {
        events: ['load', 'add', 'update', 'remove', 'error'],
        properties: {
            isLoaded: {
                get: function (owner) {
                    return owner.nodeType() != NODE_TYPE.UNKNOWN;
                },
                readonly: true
            },
            isRoot: {
                get: function (owner) {
                    return !!owner.key();
                },
                readonly: true
            },
            data: {
                value: undefined,
                readonly: true
            },
            nodeType: {
                value: NODE_TYPE.UNKNOWN,
                readonly: true
            },
            paths: {
                value: [],
                readonly: true
            },
            key: {
                value: null,
                readonly: true
            },
            subKeys: {
                value: [],
                readonly: true
            },
            storage: {
                value: null,
                readonly: true
            }
        },
        methods: {
            init: function (paths, storage) {
                if (paths === null) {
                    throw new Error('The "paths" parameter is required.');
                }

                if (storage === null) {
                    throw new Error('The "storage" parameter is required.');
                }

                storage.on('load', this._onStorageLoad, {context: this});
                storage.on('change', this._onStorageChange, {context: this});

                this.paths(paths);
                this.key(paths.slice().pop());
                this.storage(storage);
                this.loadData();
            },
            loadData: function () {
                this.storage().read(this.paths(), null);
            },
            parent: function (key) {
                var myPaths = this.paths();
                if (myPaths.length > 0) {
                    if (key) {
                        var index = array.lastIndexOf(myPaths, key);
                        if (index > 0) {
                            return this.storage().createDataNode(myPaths.slice(0, index));
                        }
                    }
                    else {
                        return this.storage().createDataNode(myPaths.slice(0, -1));
                    }
                }

                return null;
            },
            child: function (paths) {
                if (paths) {
                    return this.storage().createDataNode(this.paths().concat(paths));
                }

                return null;
            },
            getValue: function (key) {
                if (this.nodeType() == NODE_TYPE.DICT) {
                    return this.data()[key];
                }
            },
            setValue: function (key, value) {
                if (this.nodeType() == NODE_TYPE.DICT && !line.isObject(value)) {
                    this.storage().write(this.paths(), key, 'update', value);
                }
            },
            addChild: function (child, key) {
                switch (this.nodeType()) {
                    case NODE_TYPE.DICT:
                    case NODE_TYPE.LIST:
                        if (!line.has(this.data(), key)) {
                            this.storage().write(this.paths(), key, 'add', child);
                        }
                        break;
                }
            },
            removeChild: function (key) {
                switch (this.nodeType()) {
                    case NODE_TYPE.DICT:
                    case NODE_TYPE.LIST:
                        if (line.has(this.data(), key)) {
                            this.storage().write(this.paths(), key, 'remove');
                        }
                        break;
                }
            },
            _onStorageLoad: function (sender, event) {
                var paths = event.paths;
                var data = event.data;
                this.subKeys(event.subKeys);
                if (this.paths().join('') == paths.join('')) {
                    this.data(data);
                    switch (line.getType(data)) {
                        case 'Object':
                            this.nodeType(NODE_TYPE.DICT, true);
                            break;
                        case 'Array':
                            this.nodeType(NODE_TYPE.LIST, true);
                            break;
                        case 'String':
                        case 'Number':
                        case 'Boolean':
                        case 'Null':
                            this.nodeType(NODE_TYPE.VALUE, true);
                            break;
                        default:
                            this.nodeType(NODE_TYPE.EMPTY, true);
                            break;
                    }

                    this.fire('load');
                }
            },
            _onStorageChange: function (sender, event) {
                var action = event.action;
                var paths = event.paths;
                var key = event.key;
                var data = event.data;
                var nodeType = this.nodeType();

                if (this.paths().join('') == paths.join('')) {
                    switch (action) {
                        case 'add':
                            if (nodeType == NODE_TYPE.DICT) {
                                this.data()[key] = data;
                            }
                            else if (nodeType == NODE_TYPE.LIST) {
                                this.data().push(data);
                            }
                            break;
                        case 'update':
                            this.data()[key] = data;
                            break;
                        case 'remove':
                            if (nodeType == NODE_TYPE.DICT) {
                                delete this.data()[key];
                            }
                            else if (nodeType == NODE_TYPE.LIST) {
                                this.data().splice(+key, 1);
                            }
                            break;
                    }

                    this.fire(action, {
                        key: key,
                        data: data
                    });
                }
            }
        }
    });
})(line, line.array);
