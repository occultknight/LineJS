line.module([
    './Component',
    './_DOMComponent',
    './_DOMContainer',
    './_DOMUtil'
], function (Component, DOMComponent, DOMContainer, DOMUtil) {

    var views = {};

    var View = line.define('View', DOMComponent, {
        abstract: true,
        statics: {
            create: function (json, owner) {
                var comp = null;
                var parsedDef = View.parseJSON(json, owner);

                if (line.is(parsedDef, 'Array')) {
                    comp = new DOMContainer();
                    line.each(parsedDef, function (d) {
                        (View.create(d, owner)).attach(comp);
                    });
                }
                else {
                    var type = parsedDef.$type;
                    var tag = parsedDef.$tag;
                    var name = parsedDef.$name;
                    var content = parsedDef.$content;

                    if (type) {
                        if (line.is(type, 'string')) {
                            type = View.resolve(type);
                        }

                        if (line.is(type, 'function')) {
                            comp = new type();
                        }
                        else {
                            throw new Error('Type "' + type + '" is not defined');
                        }
                    }
                    else {
                        comp = new DOMComponent(tag || 'div');
                    }

                    line.each(parsedDef, function (value, key) {
                        if (key.charAt(0) !== '$') {
                            comp.bind(key, value);
                        }
                    });

                    if (content) {
                        if (comp.can('__render__')) {
                            comp.__render__(content);
                        }
                        else if (line.is(content, Component)) {
                            content.attach(comp);
                        }
                        else if (line.is(content, 'array')) {
                            line.each(content, function (c) {
                                View.create(c).attach(comp);
                            }, this);
                        }
                        else if (line.is(content, 'object')) {
                            if (content.$binding) {
                                content.converter = function (value) {
                                    if (line.is(value, 'array')) {
                                        var result = [];
                                        line.each(value, function (v) {
                                            if (v && (v.$tag || v.$type || v.$content)) {
                                                result.push(View.create(v));
                                            }
                                            else {
                                                result.push(v);
                                            }
                                        });

                                        return result;
                                    }
                                    else {
                                        if (value && (value.$tag || value.$type || value.$content)) {
                                            return View.create(value);
                                        }
                                        else {
                                            return value;
                                        }
                                    }
                                };

                                comp.bind('content', content);
                            }
                            else {
                                View.create(content).attach(comp);
                            }
                        }
                        else {
                            comp.bind('content', content);
                        }
                    }

                    if (parsedDef.owner && name) {
                        parsedDef.owner.register(name, comp);
                    }
                }

                return comp;
            },
            parseJSON: function (json, owner) {
                var result;

                if (json && json.$parsed) {
                    result = json;
                }
                else if (line.is(json, 'array')) {
                    result = [];

                    line.each(json, function (item) {
                        result.push(View.parseJSON(item, owner));
                    });
                }
                else if (line.is(json, 'plain')) {
                    result = {};
                    line.each(json, function (value, key) {
                        result[key] = View.parseJSON(value, owner);
                    });

                    if (json.$type || json.$tag || json.$content || json.$name) {
                        result.$parsed = true;
                        result.owner = owner;
                    }
                }
                else if (line.is(json, 'string')) {
                    result = DOMComponent.parseBindingOptions(json, owner) || json;
                }
                else if (line.is(json, 'function')) {
                    result = json.bind(owner);
                }
                else {
                    result = json;
                }

                return result;
            },
            parseDOM: function (dom) {
                var result = {};

                line.each(dom.attributes, function (attr) {
                    var name = attr.name;
                    var value = attr.value;

                    if (name === 'line-view') {
                        var type = View.resolve(value);
                        if (line.is(type, 'function')) {
                            type.setMeta('view', result);
                        }
                        else {
                            throw new Error('Type "' + value + '" is not registered.');
                        }
                    }
                    else if (name === 'line-type') {
                        result.$type = value;
                    }
                    else if (name === 'line-name') {
                        result.$name = value;
                    }
                    else {
                        try {
                            result[name] = JSON.parse(value);
                        }
                        catch (ex) {
                            result[name] = value;
                        }
                    }
                });

                if (!result.$type) {
                    result.$tag = dom.tagName.toLowerCase();
                }

                var content = [];
                line.each(dom.children, function (child) {
                    content.push(View.parseDOM(child));
                });

                if (content.length === 0) {
                    content = DOMUtil.getText(dom);
                }

                if (content) {
                    result.$content = content;
                }

                return result;
            },
            register: function (alias, view) {
                views[alias] = view;
            },
            resolve: function (alias) {
                return views[alias];
            }
        },
        properties: {
            dom: {
                get: function () {
                    var root = this.resolve('$root');
                    if (root) {
                        return root.get('dom');
                    }
                    else {
                        return null;
                    }
                }
            },
            model: {
                get: function () {
                    return this.base();
                },
                set: function (value, options) {
                    this.resolve('$root').set('model', value, options);
                    this.base(value, options);
                }
            }
        },
        methods: {
            init: function () {
                this.base();
                var view = this.constructor.getMeta('view');
                if (view) {
                    this.register('$root', View.create(view, this));
                }
            },
            dispose: function () {
                this.base();

                var root = this.resolve('$root');
                if (root) {
                    root.dispose();
                }
            },
            on: function (name, handler, options) {
                var root = this.resolve('$root');
                if (root) {
                    root.on(name, handler, options);
                }

                return this;
            },
            off: function (name, handler, options) {
                var root = this.resolve('$root');
                if (root) {
                    root.off(name, handler, options);
                }

                return this;
            },
            fire: function (name, data, options) {
                var root = this.resolve('$root');
                if (root) {
                    root.fire(name, data, options);
                }

                return this;
            },
            __define__: function (Class) {
                var alias = Class.getMeta('alias');

                if (alias) {
                    View.register(alias, Class);
                }
            }
        }
    });

    return View;
});