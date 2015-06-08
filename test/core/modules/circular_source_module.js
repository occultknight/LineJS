line.module(['./circular_target_module'], function (mod) {
    return {
        foo1: 'foo1',
        bar1: mod.bar2
    }
});