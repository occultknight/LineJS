line.module(['./simple_module', './class_construct_module'], function (a, MyBaseClass) {
    this.foobar = a.foo + a.bar;

    this.MyClass = line.define('MyClass', MyBaseClass, {
        properties: {
            prop2: 'prop2'
        }
    });
});