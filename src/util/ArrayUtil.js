line.module(function () {

    var ArrayProto = Array.prototype;
    var nativeIndexOf = ArrayProto.indexOf;

    /**
     * @module util
     * @class ArrayUtil
     */
    return line.define('ArrayUtil', {
        static: true,
        methods: {
            first: function (array) {
                return array[0];
            },
            last: function (array) {
                var _length = array.length;
                return array[_length - 1];
            },
            indexOf: function (array, searchItem, fromIndex) {
                var i, length, value;
                var searchIndex = -1,
                    _fromIndex = (fromIndex === null || fromIndex < 0) ? 0 : fromIndex;
                if (array === null) {
                    return searchIndex;
                }

                if (nativeIndexOf && nativeIndexOf === array.indexOf) {
                    return array.indexOf(searchItem, _fromIndex);
                } else {
                    for (i = _fromIndex, length = array.length; i < length; i++) {
                        value = array[i];
                        if (searchItem === value) {
                            searchIndex = i;
                            break;
                        }
                    }
                }
                return searchIndex;
            }
        }
    });

});