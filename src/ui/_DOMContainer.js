line.module([
    '../data/Collection',
    './_DOMUtil',
    './_DOMComponent'
], function (Collection, DOMUtil, DOMComponent) {

    return line.define('DOMContainer', DOMComponent, {
        methods: {
            init: function () {
                this.base();
                this._dom = new Collection();
            },
            getAttribute: function (name) {
                return DOMUtil.getAttribute(this.get('dom')[0], name);
            },
            setAttribute: function (name, value) {
                line.each(this.get('dom'), function (dom) {
                    DOMUtil.setAttribute(dom, name, value);
                });
            },
            on: function (name, handler, options) {
                line.each(this.get('dom'), function (dom) {
                    DOMUtil.addEventListener(dom, name, handler, options && options.capture);
                });

                return this;
            },
            off: function (name, handler, options) {
                line.each(this.get('dom'), function (dom) {
                    DOMUtil.removeEventListener(dom, name, handler, options && options.capture);
                });

                return this;
            },
            fire: function (name, data, options) {
                line.each(this.get('dom'), function (dom) {
                    DOMUtil.dispatchEvent(dom, name, line.extend({
                        detail: data
                    }, options));
                });

                return this;
            },
            allocateDomSlot: function (child, index) {
                var slot = this.base(child, index);
                var before = slot.before;
                var myDom = this._dom;
                var childDom = child.get('dom');
                var domIndex = myDom.indexOf(before);

                domIndex = domIndex >= 0 ? domIndex : myDom.get('count');

                if (line.is(childDom, Collection)) {
                    myDom.insertRange(childDom, domIndex);
                }
                else {
                    myDom.insert(childDom, domIndex);
                }

                return {
                    parent: this._slot && this._slot.parent,
                    before: slot.before
                };
            },
            releaseDomSlot: function (child) {
                var myDom = this._dom;
                var childDom = child.get('dom');
                if (line.is(childDom, Collection)) {
                    childDom.each(function (dom) {
                        myDom.remove(dom);
                    });
                }
                else {
                    myDom.remove(childDom);
                }
            }
        }
    });

});