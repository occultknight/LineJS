line.module(function () {
    var globalEval = eval;

    var mimeTypes = {
        script: 'text/javascript, application/javascript, application/x-javascript',
        json: 'application/json',
        xml: 'application/xml, text/xml',
        html: 'text/html',
        text: 'text/plain'
    };

    var dataTypes = {
        'text/javascript': 'script',
        'application/json': 'json',
        'application/xml': 'xml',
        'text/html': 'html',
        'text/plain': 'text'
    };

    /**
     * @module io
     * @class HttpClient
     */
    var HttpClient = line.define('HttpClient', {
        events: ['start', 'success', 'error', 'complete'],
        statics: {
            request: function (url, options) {
                (new HttpClient()).request(url, options);
            }
        },
        properties: {
            options: null
        },
        methods: {
            init: function (options) {
                this.set('options', options);
            },
            request: function (url, options) {
                var xhr = new XMLHttpRequest();
                var settings = line.extend({
                    method: 'GET',
                    async: true
                }, this.get('options'), options);
                var type = settings.type;
                var mime = settings.mime || mimeTypes[type];
                var context = settings.context;
                var headers = {
                    'Accept': mime || '*/*',
                    'Content-Type': settings.contentType || 'application/x-www-form-urlencoded'
                };
                var protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : location.protocol;
                var self = this;

                if (!settings.crossOrigin) {
                    headers['X-Requested-With'] = 'XMLHttpRequest';
                }

                line.extend(headers, options.headers);

                if (settings.timeout > 0) {
                    xhr.timeout = settings.timeout;
                }

                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        var result = false, error = false;

                        xhr.onreadystatechange = line.noop;

                        if ((xhr.status >= 200 && xhr.status < 300) ||
                            xhr.status === 304 ||
                            (xhr.status === 0 && protocol === 'file:')) {

                            result = xhr.responseText;

                            if (!type) {
                                mime = mime || xhr.getResponseHeader('content-type');
                                mime = mime.split(',', 2)[0];
                                type = dataTypes[mime];
                            }

                            try {
                                if (type === 'script') {
                                    globalEval(result);
                                }
                                else if (type === 'xml') {
                                    result = xhr.responseXML;
                                }
                                else if (type === 'json') {
                                    result = JSON.parse(result);
                                }
                            } catch (ex) {
                                error = ex;
                            }

                        }
                        else {
                            error = xhr.statusText || null;
                        }

                        if (error) {
                            if (settings.error) {
                                settings.error.call(context, error, xhr);
                            }

                            self.fire('error', error);
                        }
                        else {
                            if (settings.success) {
                                settings.success.call(context, result, xhr);
                            }

                            self.fire('success', result);
                        }

                        if (settings.complete) {
                            settings.complete.call(context, {
                                result: result,
                                error: error
                            }, xhr);
                        }

                        self.fire('complete', {
                            result: result,
                            error: error
                        });
                    }
                };

                xhr.open(settings.method || 'GET', url, settings.async, settings.username, settings.password);

                line.each(headers, function (value, key) {
                    xhr.setRequestHeader(key, value);
                });

                xhr.send(settings.data || null);
            }
        }
    });

    return HttpClient;

});