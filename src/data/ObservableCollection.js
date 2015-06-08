line.module([
    '../core/Observable',
    './Collection'
], function (Observable, Collection) {

    /**
     * @class ObservableCollection
     * @extends line.Collection
     * @uses line.Observable
     * @constructor
     * @param iter
     */
    return line.define('ObservableCollection', Collection, {
        mixins: [Observable],
        events: ['change'],
        methods: {
            /**
             * Add an item.
             * @method add
             * @param item
             */
            add: function (item) {
                var index = this.base(item);
                this.notify('count');
                this.fire('change', {
                    action: 'add',
                    items: [item],
                    index: index
                });

                return index;
            },
            /**
             * @method addRange
             * @param iter
             */
            addRange: function (iter) {
                var index = this.base(iter);
                this.notify('count');
                this.fire('change', {
                    action: 'add',
                    items: iter,
                    index: index
                });

                return index;
            },
            /**
             * @method insert
             * @param item
             * @param index
             */
            insert: function (item, index) {
                this.base(item, index);
                this.notify('count');
                this.fire('change', {
                    action: 'add',
                    items: [item],
                    index: index
                });

                return index;
            },
            /**
             * @method insertRange
             * @param iter
             * @param index
             */
            insertRange: function (iter, index) {
                this.base(iter, index);
                this.notify('count');
                this.fire('change', {
                    action: 'add',
                    items: iter,
                    index: index
                });

                return index;
            },
            /**
             * @method remove
             * @param item
             */
            remove: function (item) {
                var index = this.base(item);
                if (index >= 0) {
                    this.notify('count');
                    this.fire('change', {
                        action: 'remove',
                        items: [item],
                        index: index
                    });
                }

                return index;
            },
            /**
             * @method removeAt
             * @param index
             */
            removeAt: function (index) {
                var item = this.base(index);
                if (item !== undefined) {
                    this.notify('count');
                    this.fire('change', {
                        action: 'remove',
                        items: [item],
                        index: index
                    });
                }

                return item;
            },
            /**
             * @method clear
             */
            clear: function () {
                var items = this.base();
                this.notify('count');
                this.fire('change', {
                    action: 'clear',
                    items: items
                });

                return items;
            },
            /**
             * @method sort
             * @param comp
             */
            sort: function (comp) {
                var result = this.base(comp);
                this.notify('count');
                this.fire('change', {
                    action: 'sort',
                    comparator: comp || function (a, b) {
                        if (a > b) {
                            return 1;
                        }
                        else if (a < b) {
                            return -1;
                        }
                        else {
                            return 0;
                        }
                    }
                });

                return result;
            }
        }
    });

});