line.module([
    './List'
], function (List) {

    return line.define('TouchView', View, {
        alias: 'line:TouchView',
        events: {
            tap: {
                add: function () {

                },
                remove: function () {

                }
            },
            swipe: {
                add: function () {

                },
                remove: function () {

                }
            }
        },
        properties: {},
        methods: {
            init: function () {
                this.base();
            },
            _onStart: function () {

            },
            _onMove: function () {

            },
            _onEnd: function () {

            }
        }
    });

});