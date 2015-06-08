module('line-core');

test('extend', function () {
    var obj = {a: 1, b: 2 };
    var result = line.extend(obj, {b: {x: 1}, c: 4, d: 5}, {d: {x: 1, y: 2}});
    deepEqual(obj, {a: 1, b: {x: 1}, c: 4, d: {x: 1, y: 2}}, 'check if target is extended.');
    equal(obj, result, 'check if the return value is same as target');
});

test('each', function () {
    var arr = [1, 4, 5, 7, 3];
    var newArr = [];

    var obj = {
        name: 'Tom',
        description: 'cat',
        version: 0.5,
        language: [
            {
                name: 'java'
            },
            {
                name: 'scala'
            }
        ]
    };
    var objKeys = [],
        objValues = [];
    line.each(arr, function (item) {
        if (item > 3) {
            newArr.push(item);
        }
    });
    line.each(obj, function (value, key) {
        objKeys.push(key);
        objValues.push(value);
    });
    equal(newArr.length, 3);
    equal(objKeys[0], 'name', 'Get the zero key');
    equal(objValues[1], 'cat', 'Get the first value');
});

test('compare', function () {
    equal(line.compare(3, 1), 1);
    equal(line.compare('abc', 'axy'), -1);
});

test('clone', function () {
    var arr = [1, 2, 3], arr1 = line.clone(arr);
    var obj = {a: 1, b: 'test', c: true}, obj1 = line.clone(obj);
    line.clone(undefined);
    line.clone(null);

    deepEqual(arr, arr1);
    deepEqual(obj, obj1);
});


test('is', function () {
    var udf = undefined,
        nul = null,
        number1 = 10,
        number2 = 10.12,
        obj1 = {},
        obj2 = new Object(),
        arr1 = [],
        arr2 = new Array(),
        fn1 = function () {
        },
        str1 = 'I am a string',
        str2 = new String('abc'),
        regexp = /\s+\d/;

    equal(line.is(udf, 'undefined'), true);
    equal(line.is(null, 'null'), true);
    equal(line.is(number1, 'number'), true);
    equal(line.is(number2, 'number'), true);
    equal(line.is(obj1, 'object'), true);
    equal(line.is(obj2, 'object'), true);
    equal(line.is(arr1, 'array'), true);
    equal(line.is(arr2, 'array'), true);
    equal(line.is(fn1, 'function'), true);
    equal(line.is(str1, 'string'), true);

    //todo:new String('abc')
    //equal(line.is(str2,'string'),true);

    //todo:isRegExp
    equal(line.is(regexp, RegExp), true);

});

test('get', function () {
    var Demo1 = line.define({
        properties: {
            example: {
                value: 123
            }
        }
    });


    var obj = {
        name: 'Tom',
        age: 29,
        items: [
            {
                name: 'Polo',
                sex: 'male',
                age: 10
            },
            {
                name: 'Jerry',
                sex: 'female',
                age: 8
            }
        ]
    };
    var demo1 = new Demo1();

    equal(line.get(obj, 'name'), 'Tom');
    equal(line.get(demo1, 'example'), 123);

});

test('has', function () {
    function Test() {
    }

    Test.prototype.a = 1;
    var obj = new Test();
    obj.b = 2;

    equal(line.has(obj, 'a'), false);
    equal(line.has(obj, 'c'), false);
    equal(line.has(obj, 'b'), true);
});


test('path', function () {
    var areaList = [
        {
            name: 'XuHui'
        },
        {
            name: 'MingHang'
        }
    ];
    var context1 = {
        name: 'ShangHai',
        area: areaList
    };
    //getByPath:
    equal(line.path(context1, 'name'), 'ShangHai');
    equal(line.path(context1, 'area'), areaList);
    //setByPath:
    equal(line.path(context1, 'testField', 'testValue'), 'testValue');
});