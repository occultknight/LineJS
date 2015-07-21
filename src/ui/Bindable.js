line.module([
    '../core/Observable'
], function (Observable) {

    var Binding = line.define(Observable, {
        properties: {
            direction: {
                value: 'oneway',
                readonly: true
            },
            target: {
                value: null,
                readonly: true
            },
            targetPath: {
                value: '',
                readonly: true
            },
            source: {
                get: function () {
                    return this._source;
                },
                set: function (value) {
                    this._source = value;

                    if (!this._ownerBinding) {
                        this._rebind();
                    }
                }
            },
            sourcePath: {
                get: function () {
                    return this._sourcePath;
                },
                set: function (value) {
                    if (value && value.charAt(0) === '#') {
                        this._sourcePath = value.substring(1);
                        this._ownerBinding = true;
                    }
                    else {
                        this._sourcePath = value;
                        this._ownerBinding = false;
                    }

                    this._rebind();
                }
            },
            owner: {
                get: function () {
                    return this._owner;
                },
                readonly: true
            },
            converter: {
                value: null
            },
            async: {
                value: false
            }
        },
        methods: {
            init: function (target, targetPath, options) {
                var member = target.member(targetPath);
                var settings = line.extend({
                    direction: 'oneway',
                    converter: null
                }, member && member.meta.binding, options);

                var direction = this._direction = settings.direction;
                var converter = this._converter = settings.converter;
                var owner = this._owner = settings.owner;
                this._source = settings.source;
                this._target = target;
                this._targetPath = targetPath;
                this._executing = false;

                if (line.is(converter, 'string')) {
                    converter = owner[converter];
                }

                if (line.is(converter, 'function')) {
                    converter = {
                        convert: converter,
                        convertBack: line.noop
                    };
                }

                this._converter = converter;

                if (direction === 'oneway' || direction === 'twoway') {
                    this.set('sourcePath', settings.sourcePath);
                }

                if (direction === 'twoway' || direction === 'inverse') {
                    target.watch(targetPath, function (value) {
                        if (!this._executing) {
                            this._executing = true;
                            line.path(this._ownerBinding ? owner : this.get('source'), this.get('sourcePath'), value);
                            this._executing = false;
                        }
                    }, this);
                }
            },
            dispose: function () {
                this._source = null;
                this._rebind();
            },
            _rebind: function () {
                var owner = this._owner;
                var source = this._ownerBinding ? owner : this._source;
                var sourcePath = this._sourcePath;
                var target = this._target;
                var targetPath = this._targetPath;
                var watcher = this._watcher;
                var converter = this._converter;
                var handler;

                if (watcher) {
                    watcher.source.unwatch(watcher.path, watcher.handler);
                    this._watcher = null;
                }

                if (converter) {
                    handler = function (value) {
                        if (!this._executing) {
                            this._executing = true;
                            target.set(targetPath, converter.convert.call(owner, line.is(value, 'function') ? value.bind(owner) : value));
                            this._executing = false;
                        }
                    };
                }
                else {
                    handler = function (value) {
                        if (!this._executing) {
                            this._executing = true;
                            target.set(targetPath, line.is(value, 'function') ? value.bind(owner) : value);
                            this._executing = false;
                        }
                    };
                }

                if (line.can(source, 'watch')) {
                    source.watch(sourcePath, handler, this);
                    this._watcher = {
                        source: source,
                        path: sourcePath,
                        handler: handler
                    };
                }

                handler.call(this, line.path(source, sourcePath));
            }
        }
    });

    var Bindable = line.define('Bindable', Observable, {
        statics: {
            parseBindingOptions: function (value, owner) {
                var result = null;
                if (typeof value === 'string' &&
                    value.charAt(0) === '{' &&
                    value.charAt(value.length - 1) === '}') {

                    var expr = value.slice(1, -1);
                    var tokens = expr.split(',');
                    var path = tokens.shift();

                    if (path === '.') {
                        path = '';
                    }

                    result = {
                        $binding: true,
                        owner: owner,
                        sourcePath: path
                    };

                    line.each(tokens, function (token) {
                        var option = token.split('=');
                        result[option[0]] = option[1];
                    });
                }
                else if (value && value.$binding) {
                    result = value;
                }

                return result;
            }
        },
        properties: {
            model: {
                get: function () {
                    return this._model;
                },
                set: function (value) {
                    this._model = value;
                    line.each(this._bindings, function (binding) {
                        binding.set('source', value);
                    });
                }
            }
        },
        methods: {
            init: function () {
                this.base();
                this._bindings = {};
            },
            dispose: function () {
                this.base();
                line.each(this._bindings, function (binding) {
                    binding.dispose();
                });
                this._bindings = null;
            },
            bind: function (name, value) {
                var binding = Bindable.parseBindingOptions(value);
                if (binding) {
                    this.setBinding(name, binding);
                }
                else {
                    this.set(name, value);
                }
            },
            getBinding: function (name) {
                return this._bindings[name];
            },
            setBinding: function (name, options) {
                this.clearBinding(name);
                var binding = this._bindings[name] = new Binding(this, name, options);
                binding.set('source', this.get('model'));
            },
            clearBinding: function (name) {
                var binding = this._bindings[name];
                if (binding) {
                    binding.dispose();
                    delete this._bindings[name];
                }
            }
        }
    });

    return Bindable;

});