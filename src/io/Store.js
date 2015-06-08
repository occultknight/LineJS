(function (line) {
    line.define('line.data.Store', null, {
        events: ['load', 'change', 'error'],
        properties: {
            storage: {
                value: null,
                readonly: true
            },
            pathDelimiter: {
                value: null,
                readonly: true
            }
        },
        methods: {
            init: function (address) {
                var storage = null, pathDelimiter = null;

                if (!address) {
                    storage = new line.data.Storage({});
                }
                else if (typeof address == 'object') {
                    storage = new line.data.Storage(target);
                }
                else if (typeof address == 'string') {
                    var colonPos = address.indexOf('://');
                    if (colonPos < 0) {
                        throw new Error('Invalid storage expression.');
                    }
                    else {
                        var storageType = address.slice(0, colonPos);
                        var storageAddress = address.slice(colonPos + 3);

                        switch (storageType) {
                            case 'local':
                                storage = new line.data.WebStorage(storageAddress);
                                pathDelimiter = '.';
                                break;
                            case 'session':
                                storage = new line.data.WebStorage(storageAddress, true);
                                pathDelimiter = '.';
                                break;
                            case 'indexeddb':
                                storage = new line.data.DbStorage(storageAddress);
                                pathDelimiter = '.';
                                break;
                            case 'http':
                            case 'https':
                                storage = new line.data.HttpStorage(address);
                                pathDelimiter = '/';
                                break;
                            case 'ws':
                            case 'wss':
                                storage = new line.data.WebSocketStorage(address);
                                pathDelimiter = '/';
                                break;
                        }
                    }
                }
                else {
                    throw new Error('Invalid parameter "address".');
                }

                storage.on('load', this._onStorageLoad, {context: this});
                storage.on('change', this._onStorageChange, {context: this});
                storage.on('error', this._onStorageError, {context: this});
                this.storage(storage);
                this.pathDelimiter(pathDelimiter);
            },
            load: function (path) {
                return this.storage().createDataNode(path ? path.split(this.pathDelimiter()) : []);
            },
            ready: function (callback) {
                this.storage().ready(callback);
            },
            _onStorageLoad: function (sender, event) {
                this.fire('load', event);
            },
            _onStorageChange: function (sender, event) {
                this.fire('change', event);
            },
            _onStorageError: function (sender, event) {
                this.fire('error', event);
            }
        }
    });
})(line);
