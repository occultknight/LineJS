line.module([
    './List'
], function (List) {

    return line.define('Selector', List, {
        alias: 'line:Selector',
        events: ['change'],
        properties: {
            value: {
                get: function () {
                    return this._value;
                },
                set: function (value) {
                    this._value = value;
                    this.notify('index');
                }
            },
            index: {
                get: function () {
                    return line.index(this.get('items'), this.get('value'));
                },
                set: function (value) {
                    this.set('value', this.get('items')[value]);
                }
            }
        },
        methods: {
            init: function () {
                this.base();
            },
            previous: function () {

            },
            next: function () {

            }
        }
    });

});