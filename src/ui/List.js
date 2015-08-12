line.module([
    './_DOMContainer',
    './View'
], function (DOMContainer, View) {

    return line.define('List', DOMContainer, {
        events: ['add', 'remove', 'replace'],
        alias: 'line:List',
        properties: {
            template: {
                get: function () {
                    return this._template;
                },
                set: function (value) {
                    this._template = value;
                    this._generateChildren();
                }
            },
            items: {
                get: function () {
                    return this._items;
                },
                set: function (value) {
                    var items = this._items;
                    if (items && items.off) {
                        items.off('change', this._onItemsChange);
                    }
                    items = this._items = value;
                    if (items && items.on) {
                        items.on('change', this._onItemsChange);
                    }

                    this._generateChildren();
                }
            }
        },
        methods: {
            init: function () {
                this.base();
                this._onItemsChange = this._onItemsChange.bind(this);
            },
            dispose: function () {
                this.base();
                this.set('items', null);
            },
            _generateChildren: function () {
                var template = this._template;
                var items = this._items;
                line.each(this.get('children').toArray(), function (c) {
                    this.fire('remove', c);
                    c.destroy();
                }, this);

                if (template && items) {
                    line.each(items, function (item) {
                        var comp = View.create(template);
                        comp.set('model', item);
                        comp.attach(this);
                        this.fire('add', comp);
                    }, this);
                }
            },
            _onItemsChange: function (event) {
                var template = this._template;
                var action = event.action;
                var index = event.index;
                if (action === 'add') {
                    line.each(event.items, function (item) {
                        var comp = View.create(template);
                        comp.set('model', item);
                        comp.attach(this, index);
                        this.fire('add', comp);
                    }, this);
                }
                else if (action === 'remove') {
                    line.each(event.items, function (item) {
                        line.each(this.get('children').toArray(), function (comp) {
                            if (comp.get('model') === item) {
                                this.fire('remove', comp);
                                comp.detach();
                            }
                        }, this);
                    }, this);
                }
                else if (action === 'replace') {
                    var oldItem = event.oldItem,
                        newItem = event.newItem;

                    line.each(this.get('children').toArray(), function (comp) {
                        if (comp.get('model') === oldItem) {
                            comp.set('model', newItem);
                            this.fire('replace', comp);
                        }
                    }, this);
                }
                else if (action === 'sort') {
                    var comparator = event.comparator;
                    var sortedChildren = this.get('children').toArray().sort(function (a, b) {
                        return comparator(a.get('model'), b.get('model'));
                    });

                    line.each(sortedChildren, function (comp) {
                        comp.attach(this);
                    }, this);
                }
                else {
                    this._generateChildren();
                }
            },
            __define__: function (Class) {
                var alias = Class.getMeta('alias');

                if (alias) {
                    View.register(alias, Class);
                }
            },
            __render__: function (content) {
                this.set('template', content);
            }
        }
    });

});