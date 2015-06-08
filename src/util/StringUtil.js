line.module(function () {

    /**
     * @module util
     * @class StringUtil
     */
    return line.define('StringUtil', {
        static: true,
        methods: {
            repeat: function (repeatString, length) {
                var _fillArrayLength = length + 1,
                    _fillArray = new Array(_fillArrayLength);
                return _fillArray.join(repeatString);
            }
        }
    });

});