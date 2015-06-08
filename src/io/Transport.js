(function (line) {
    line.define('line.io.Transport', {
        abstract: true,
        events: ['open', 'close', 'message', 'error'],
        methods: {
            open: function () {
            },
            send: function () {
            },
            close: function () {
            }
        }
    });

    line.define('line.io.WebSocketTransport', line.io.Transport, {
        methods: {
            init: function () {
                if (!window.WebSocket) {
                    throw new TypeError('"WebSocket" is not supported.');
                }
            },
            open: function (url) {
                if (!this._webSocket) {
                    var webSocket = this._webSocket = new WebSocket(url);
                    webSocket.onopen = this._onOpen.bind(this);
                    webSocket.onclose = this._onClose.bind(this);
                    webSocket.onmessage = this._onMessage.bind(this);
                    webSocket.onerror = this._onError.bind(this);
                } else {
                    throw new Error('The WebSocket is already opened.');
                }
            },
            send: function (data) {
                var webSocket = this._webSocket;
                if (webSocket) {
                    webSocket.send(data);
                }
                else {
                    throw new Error('The WebSocket is not opened.');
                }
            },
            close: function () {
                if (this._webSocket) {
                    this._webSocket.close();
                    this._webSocket = null;
                }
                else {
                    throw new Error('The WebSocket is already closed.');
                }
            },
            _onOpen: function (event) {
                this.fire('open', event);
            },
            _onClose: function () {
                this.fire('close', event);
            },
            _onMessage: function () {
                this.fire('message', event);
            },
            _onError: function () {
                this.fire('error', event);
            }
        }
    });

    line.define('line.io.HttpTransport', line.io.Transport, {});

})(line);
