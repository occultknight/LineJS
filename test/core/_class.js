module("line-class");

var MyStaticClass = line.define({
    static: true,
    properties: {
        staticProp: 'static!'
    },
    methods: {
        staticMethod: function () {
            return 'static!!'
        }
    }
});

var MyBaseClass = line.define({
    statics: {
        static1: 'test'
    },
    events: ['event1', 'event2', 'event3'],
    properties: {
        prop1: 1,
        prop2: {
            value: 'foo'
        },
        prop3: {
            get: function () {
                return 'bar';
            }
        },
        prop4: {
            value: false
        },
        prop5: {
            get: function () {
                return this._prop5;
            },
            set: function (value) {
                this._prop5 = value;
            }
        },
        prop6: {
            get: function () {
                return this._prop5 + '!';
            }
        }
    },
    methods: {
        init: function (v) {
            this._value = v;
        },
        method1: function () {
            return 'hello';
        },
        method2: function () {
            return this.get('prop2');
        },
        method3: function () {
            return this.get('prop3');
        },
        method4: function (val) {
            this.set('prop4', val);
        },
        method5: function (val) {
            this.set('prop5', val);
        }
    }
});

var MyChildClass = line.define(MyBaseClass, {
    events: ['event1', 'event4'],
    properties: {
        prop1: 5,
        prop7: {
            value: 'new prop'
        }
    },
    methods: {
        init: function (v) {
            this.base(v + 1);
        },
        method1: function () {
            return 'world';
        },
        method4: function (val) {
            this.base(val + '!!');
        },
        method6: function () {
            this.set('prop7', 'new value');
        }
    }
});

test('define a class', function () {
    var base = new MyBaseClass(1);
    var child = new MyChildClass(5);

    ok(base._value === 1, 'base ctor');
    ok(MyBaseClass.static1 === 'test', 'base statics');

    ok(child._value === 6, 'child ctor');
});

test('class events', function () {
    var base = new MyBaseClass();
    var child = new MyChildClass();
    var h1, h2, h3, h4, h5, h6, h7, h8, h9;
    var n1 = 0, n2 = 0, n3 = 0, n4 = 0, n5 = 0, n6 = 0, n7 = 0, n8 = 0, n9 = 0;

    base.on('event1', h1 = function (event) {
        n1 = event;
    });
    base.fire('event1', 99);
    base.on('event2', h2 = function (event) {
        n2++;
    });
    base.off('event2', h2);
    base.fire('event2');

    base.onevent3 = function (event) {
        n3++;
    };

    base.fire('event3');
    base.onevent3 = function (event) {
        n4++;
    };
    base.fire('event3');

    base.on('event2', h5 = function (event) {
        n5++;
    });

    base.on('event2', h6 = function (event) {
        n6++;
    });

    base.onevent2 = function (event) {
        n7++;
    };

    base.fire('event2');

    base.off('event2', h5);

    base.fire('event2');

    child.on('event4', h8 = function (event) {
        n8++;
    });

    child.on('event1', h9 = function (event) {
        n9++;
    });

    child.fire('event4');
    child.fire('event1');

    equal(n1, 99, 'on an event handler');
    equal(n2, 0, 'off an event handler');
    equal(n3, 1, 'upon an event handler');
    ok(n3 == 1 && n4 == 1, 'upon another event handler');
    ok(n5 == 1 && n6 == 2 && n7 == 2, 'mix multiple event handlers');
    ok(n8 == 1 && n9 == 1, 'inherit event handlers');
});

test('class properties', function () {
    var base = new MyBaseClass();
    var child = new MyChildClass();
    base.set('prop4', true);
    base.set('prop5', 'hi');

    equal(base.get('prop1'), 1, 'simple default value');
    equal(base.get('prop2'), 'foo', 'complex default value');
    equal(base.get('prop3'), 'bar', 'simple getter');
    equal(base.get('prop4'), true, 'simple setter');
    equal(base.get('prop5'), 'hi', 'getter and setter');
    equal(base.get('prop6'), 'hi!', 'dependent getter');
    equal(child.get('prop1'), 5, 'inherit property');
    equal(child.get('prop7'), 'new prop', 'new property');
});

test('class methods', function () {
    var base = new MyBaseClass();
    var child = new MyChildClass();

    base.method4('oh');
    child.method4('oh');
    child.method4('oh');
    child.method4('oh');
    child.method6();

    ok(base.method1() === 'hello', 'simple method');
    ok(base.get('prop4') === 'oh', 'method with property');
    ok(child.method1() === 'world', 'override a method');
    ok(child.get('prop4') === 'oh!!', 'override a method');
});

test('static class', function () {
    var v1, v2;

    v1 = MyStaticClass.get('staticProp');
    MyStaticClass.set('staticProp', '123');
    v2 = MyStaticClass.get('staticProp');

    ok(line.is(MyStaticClass, 'function'), 'define static class');
    ok(MyStaticClass.__meta__.static === true, 'static indicator');
    ok(v1 === 'static!' && v2 === '123', 'static prop');
    ok(MyStaticClass.staticMethod() === 'static!!', 'static method');
    throws(function () {
        new MyStaticClass()
    }, 'prevent instantiation');

    throws(function () {
        var MyClass = line.define(MyStaticClass, {});
    }, 'prevent inheritance');

    throws(function () {
        var MyClass = line.define(null, {});
    }, 'wrong base');
});