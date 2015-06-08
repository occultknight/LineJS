line.module([
    '../data/Collection',
    './_DOMUtil',
    './Bindable',
    './Component'
], function (Collection, DOMUtil, Bindable, Component) {

    var CssClass = line.define(Bindable, {
        methods: {
            init: function (comp) {
                this.base();
                this._comp = comp;
                this._classList = [];
            },
            dispose: function () {
                this.base();
                this._comp = null;
                this._classList = null;
            },
            get: function (name) {
                if (this.has(name)) {
                    return this.base(name);
                }
                else {
                    return this._classList[name];
                }
            },
            set: function (name, value) {
                if (this.has(name)) {
                    this.base(name, value);
                }
                else {
                    this._classList[name] = value;
                    this._updateClass();
                }
            },
            hasClass: function (name) {
                return this._classList.indexOf(name) >= 0;
            },
            addClass: function (name) {
                if (!this.hasClass(name)) {
                    this._classList.push(name);
                    this._updateClass();
                }
            },
            removeClass: function (name) {
                var index = this._classList.indexOf(name);
                if (index >= 0) {
                    this._classList.splice(index, 1);
                    this._updateClass();
                }
            },
            _updateClass: function () {
                this._comp.setAttribute('class', this._classList.join(' '));
            }
        }
    });

    var CssStyle = line.define(Bindable, {
        methods: {
            init: function (comp) {
                this.base();
                this._comp = comp;
            },
            dispose: function () {
                this.base();
                this._comp = null;
            },
            get: function (name) {
                if (this.has(name)) {
                    return this.base(name);
                }
                else {
                    return DOMUtil.getStyle(this._comp.get('dom'), name);
                }
            },
            set: function (name, value) {
                if (this.has(name)) {
                    this.base(name, value);
                }
                else {
                    DOMUtil.setStyle(this._comp.get('dom'), name, value);
                }
            }
        }
    });

    return line.define('DOMComponent', Component, {
        properties: {
            dom: {
                get: function () {
                    return this._dom;
                }
            },
            class: {
                get: function () {
                    return this._class;
                },
                set: function (value) {
                    if (line.is(value, 'Array')) {
                        var cssClass = this._class;
                        line.each(value, function (item, index) {
                            cssClass.bind('' + index, item);
                        }, this);
                    }
                    else {
                        this.setAttribute('class', value);
                    }
                }
            },
            style: {
                get: function () {
                    return this._style;
                },
                set: function (value) {
                    if (line.is(value, 'Object')) {
                        var cssStyle = this._style;
                        line.each(value, function (val, key) {
                            cssStyle.bind(key, val);
                        }, this);
                    }
                    else {
                        this.setAttribute('style', value);
                    }
                }
            },
            content: {
                get: function () {
                    return DOMUtil.getHtml(this.get('dom'));
                },
                set: function (value) {
                    line.each(this.get('children').toArray(), function (c) {
                        c.destroy();
                    });

                    DOMUtil.setHtml(this.get('dom'), '');

                    this._content = value;

                    if (line.is(value, Component)) {
                        value.attach(this);
                    }
                    else if (line.is(value, 'array')) {
                        line.each(value, function (c) {
                            if (line.is(c, Component)) {
                                c.attach(this);
                            }
                        }, this);
                    }
                    else {
                        DOMUtil.setHtml(this.get('dom'), value);
                    }
                }
            },
            checked: {
                get: function () {
                    return this.getAttribute('checked');
                },
                set: function (value) {
                    this.setAttribute('checked', value);
                },
                binding: {
                    direction: 'twoway'
                }
            },
            value: {
                get: function () {
                    return this.getAttribute('value');
                },
                set: function (value) {
                    this.setAttribute('value', value);
                },
                binding: {
                    direction: 'twoway'
                }
            },
            model: {
                get: function () {
                    return this.base();
                },
                set: function (value, options) {
                    this._class.set('model', value);
                    this._style.set('model', value);
                    this.base(value, options);
                }
            }
        },
        methods: {
            init: function (dom) {
                this.base();
                this._eventListeners = {};

                if (dom) {
                    if (dom === 'text') {
                        this._dom = DOMUtil.createTextNode('');
                    }
                    else if (dom.nodeType) {
                        this._dom = dom;
                    }
                    else if (dom) {
                        this._dom = DOMUtil.createElement(dom);
                    }

                    var tag = this._dom.tagName || 'text';
                    tag = tag.toLowerCase();

                    if (tag === 'input' || tag === 'textarea' || tag === 'select') {
                        this.on('input', function (e) {
                            console.log(e);
                            this.notify('value');
                        }.bind(this));

                        this.on('change', function (event) {
                            var type = event.target.type;
                            this.notify('value');
                            if (type === 'checkbox' || type === 'radio') {
                                this.notify('checked');
                            }
                        }.bind(this));
                    }
                }

                this._class = new CssClass(this);
                this._style = new CssStyle(this);
            },
            dispose: function () {
                this._class.dispose();
                this._style.dispose();
                this._eventlisteners = {};
                this.base();
            },
            get: function (name, options) {
                var member = this.member(name);
                if (member) {
                    return this.base(name, options);
                }
                else {
                    return this.getAttribute(name);
                }
            },
            set: function (name, value, options) {
                var member = this.member(name);
                if (member) {
                    return this.base(name, value, options);
                }
                else {
                    return this.setAttribute(name, value);
                }
            },
            getAttribute: function (name) {
                return DOMUtil.getAttribute(this.get('dom'), name);
            },
            setAttribute: function (name, value) {
                return DOMUtil.setAttribute(this.get('dom'), name, value);
            },
            on: function (name, handler, options) {
                DOMUtil.addEventListener(this.get('dom'), name, handler, options && options.capture);
                return this;
            },
            off: function (name, handler, options) {
                DOMUtil.removeEventListener(this.get('dom'), name, handler, options && options.capture);
                return this;
            },
            fire: function (name, data, options) {
                DOMUtil.dispatchEvent(this.get('dom'), name, line.extend({
                    detail: data
                }, options));

                return this;
            },
            afterAttach: function (parent, index) {
                var slot = this._slot = parent.can('allocateDomSlot') ? parent.allocateDomSlot(this, index) : {
                    parent: parent.get('dom')
                };

                var myDom = this.get('dom');

                if (slot.before) {
                    if (line.is(myDom, Collection)) {
                        myDom.each(function (dom) {
                            DOMUtil.before(dom, slot.before);
                        });
                    }
                    else {
                        DOMUtil.before(myDom, slot.before);
                    }
                }
                else if (slot.parent) {
                    if (line.is(myDom, Collection)) {
                        myDom.each(function (dom) {
                            DOMUtil.append(slot.parent, dom);
                        });
                    }
                    else {
                        DOMUtil.append(slot.parent, myDom);
                    }
                }
            },
            afterDetach: function (parent) {
                var myDom = this.get('dom');
                if (line.is(myDom, Collection)) {
                    myDom.each(function (dom) {
                        DOMUtil.remove(dom);
                    });
                }
                else {
                    DOMUtil.remove(myDom);
                }

                if (parent.releaseDomSlot) {
                    parent.releaseDomSlot(this);
                    this._slot = null;
                }
            },
            allocateDomSlot: function (child, index) {
                var before = null;
                if (index >= 0) {
                    before = this.get('children')[index + 1];
                    if (before) {
                        before = before.get('dom');
                    }

                    if (line.is(before, Collection)) {
                        before = before[0];
                    }
                }

                return {
                    parent: this.get('dom'),
                    before: before
                };
            },
            releaseDomSlot: function (child) {
            }
        }
    });

});