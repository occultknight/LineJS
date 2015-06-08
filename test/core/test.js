line.module([
    './modules/',
    './modules/class_module',
    'node:path',
    'core',
    'data'
], function (mod, mod2, fs, core, data) {
    var instance = new mod.MyClass();
    console.log(Object.keys(mod));
    console.log(Object.keys(mod2));
    console.log(Object.keys(fs));
    console.log(Object.keys(core));
    console.log(Object.keys(data));
    console.log(instance.gets());
//    console.log(mod.test);
});