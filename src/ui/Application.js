line.module([
    './_DOMUtil',
    './Component',
    './View'
], function (DOMUtil, Component, View) {

    return line.define('Application', Component, {
        abstract: true,
        properties: {
            autoparse: true,
            dom: {
                get: function () {
                    return document.body;
                }
            }
        },
        methods: {
            init: function () {
                this.base();
                this._documentEventListeners = {};
                this._windowEventListeners = {};
            },
            start: function () {
                if (this.get('autoparse')) {
                    this.parse();
                }
            },
            stop: function () {
                //Not implemented
            },
            on: function (name, handler, options) {
                this.base(name, handler, options);

                if (!this.may(name)) {
                    this._addEventListener(name, options && options.global);
                }
            },
            parse: function () {
                line.each(document.getElementsByTagName('*'), function (el) {
                    if (el) {
                        var viewName = el.getAttribute('line-view');
                        if (viewName) {
                            var json = View.parseDOM(el);
                            var view = View.resolve(viewName);
                            if (line.is(view, 'function')) {
                                var comp = new view();
                                DOMUtil.replace(el, comp.get('dom'));
                                if (json.$name) {
                                    this.register(json.$name, comp);
                                }
                            }
                        }
                    }
                });
            },
            _addEventListener: function (name, win) {
                var listeners = win ? this._windowEventListeners : this._documentEventListeners;
                var listener = listeners[name];
                var target = win ? window : document;
                var self = this;

                if (!listener) {
                    listener = listeners[name] = function () {
                        self.fire(name, event);
                    };

                    DOMUtil.addEventListener(target, name, listener, false);
                }
            }
        }
    });

});
