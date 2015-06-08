line.module([
    '../data/Collection',
    './Bindable'
], function (Collection, Bindable) {

    var EventDelegator = line.define(Bindable, {
        methods: {
            init: function (comp) {
                this.base();
                this._comp = comp;
                this._handlers = {};
            },
            get: function (name, options) {
                if (this.has(name)) {
                    return this.base(name, options);
                }
                else {
                    return this._events[name];
                }
            },
            set: function (name, value, options) {
                if (this.has(name)) {
                    this.base(name, value, options);
                }
                else {
                    var comp = this._comp;
                    var handler = this._handlers[name];
                    comp.off(name, handler);

                    if (value) {
                        handler = function () {
                            value(this.get('model'));
                        }.bind(this);

                        this._handlers[name] = handler;
                        this._comp.on(name, handler);
                    }
                    else {
                        this._handlers[name] = null;
                    }
                }
            }
        }
    });

    var Component = line.define('Component', Bindable, {
        abstract: true,
        properties: {
            owner: {
                value: null
            },
            parent: {
                value: null
            },
            children: {
                value: null
            },
            model: {
                get: function () {
                    return this._ownModel === undefined ? this.base() : this._ownModel;
                },
                set: function (value, options) {
                    var inherit = options && options.inherit;

                    if (!inherit) {
                        this._ownModel = value;
                    }

                    if (!inherit || this._ownModel === undefined) {
                        this.get('children').each(function (c) {
                            c.set('model', value, {
                                inherit: true
                            });
                        });

                        this._events.set('model', value);
                        this.base(value);
                    }
                }
            },
            events: {
                get: function () {
                    return this._events;
                },
                set: function (value) {
                    var events = this._events;
                    line.each(value, function (val, key) {
                        events.bind(key, val);
                    }, this);
                }
            }
        },
        methods: {
            init: function () {
                this.base();
                this._children = new Collection();
                this._events = new EventDelegator(this);
                this._resources = {};
            },
            get: function (name, options) {
                var member = this.member(name);
                if (member) {
                    if (member.get) {
                        return member.get.call(this, options);
                    }
                    else {
                        return member.execute;
                    }
                }
            },
            set: function (name, value, options) {
                var member = this.member(name);
                if (member.set) {
                    return member.set.call(this, value, options);
                }
            },
            attach: function (parent, index) {
                if (this.get('parent')) {
                    throw new Error('The component has already been attached.');
                }

                if (line.is(parent, Component)) {
                    if (!this.beforeAttach(parent, index)) {
                        return false;
                    }

                    if (!parent.beforeChildAttach(this, index)) {
                        return false;
                    }

                    var model = parent.get('model');
                    this.set('parent', parent);
                    if (model !== undefined) {
                        this.set('model', parent.get('model'), {
                            inherit: true
                        });
                    }

                    if (index >= 0) {
                        parent.get('children').insert(this, index);
                    }
                    else {
                        parent.get('children').add(this);
                    }

                    if (!parent.afterChildAttach(this, index)) {
                        return false;
                    }

                    if (!this.afterAttach(parent, index)) {
                        return false;
                    }
                }
            },
            detach: function () {
                var parent = this.get('parent');
                if (parent) {
                    var index = parent.get('children').indexOf(this);

                    if (!this.beforeDetach(parent, index)) {
                        return false;
                    }

                    if (!parent.beforeChildDetach(this, index)) {
                        return false;
                    }

                    this.set('parent', null);

                    parent.get('children').remove(this);

                    if (!parent.afterChildDetach(this, index)) {
                        return false;
                    }

                    if (!this.afterDetach(parent, index)) {
                        return false;
                    }
                }
            },
            register: function (name, value) {
                this._resources[name] = value;
            },
            unregister: function (name) {
                delete this._resources[name];
            },
            resolve: function (name) {
                return this._resources[name];
            },
            dispose: function () {
                this.base();
                line.each(this.get('children'), function (child) {
                    child.dispose();
                });
            },
            destroy: function () {
                this.detach();
                this.base();
            },
            beforeAttach: function (parent, index) {
                //template method
                return true;
            },
            afterAttach: function (parent, index) {
                //template method
                return true;
            },
            beforeDetach: function (parent) {
                //template method
                return true;
            },
            afterDetach: function (parent) {
                //template method
                return true;
            },
            beforeChildAttach: function (child, index) {
                //template method
                return true;
            },
            afterChildAttach: function (child, index) {
                //template method
                return true;
            },
            beforeChildDetach: function (child, index) {
                //template method
                return true;
            },
            afterChildDetach: function (child, index) {
                //template method
                return true;
            }
        }
    });

    return Component;

});