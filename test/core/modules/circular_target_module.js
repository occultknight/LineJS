line.module(['./circular_source_module'], function (mod) {
    return {
        foo2: mod.foo1,
        bar2: 'bar2'
    }
});