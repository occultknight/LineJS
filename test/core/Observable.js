module("Observable");

var Repository = line.define(line.Observable, {
    properties: {
        name: null,
        url: null
    },
    methods: {
        init: function (options) {
            this.base();
            this.sets(options);
        }
    }
});

var Project = line.define(line.Observable, {
    properties: {
        name: null,
        issues: {
            get: function () {
                return this._issues;
            },
            set: function (value) {
                this._issues = value;
            }
        },
        repository: null
    },
    methods: {
        init: function (options) {
            this.base();
            this.sets(options);
        }
    }
});

var Person = line.define(line.Observable, {
    properties: {
        name: 'Unknown',
        age: 20,
        gender: 'male',
        company: {
            get: function () {
                return this._company;
            },
            set: function (value) {
                this._company = value;
            }
        },
        title: {
            get: function () {
                return this._title;
            },
            set: function (value) {
                this._title = value;
            }
        },
        address: {
            get: function () {
                return this._address;
            },
            set: function (value) {
                this._address = value;
            }
        },
        project: null
    },
    methods: {
        init: function (options) {
            this.base();
            this.sets(options);
        }
    }
});

var repo1 = new Repository({
    name: 'GitHub',
    url: 'http://github.com'
});

var repo2 = new Repository({
    name: 'SourceForge',
    url: 'http://sourceforge.org'
});

var proj1 = new Project({
    name: 'Project1',
    issues: ['issue341', 'issue365', 'issue553'],
    repository: repo1
});

var proj2 = new Project({
    name: 'Project2',
    issues: ['issue46', 'issue71'],
    repository: repo1
});

var p1 = new Person({
    name: 'Tom',
    age: 23,
    gender: 'male',
    company: 'NEXT',
    title: 'Engineer',
    address: {
        primary: {
            city: 'SFC',
            line1: 'No.999'
        },
        secondary: {
            city: 'SAN',
            line1: 'No.888'
        }
    },
    project: proj1
});

var p2 = new Person({
    name: 'Jerry',
    age: 21,
    gender: 'male',
    company: 'NEXT',
    title: 'Designer',
    address: {
        primary: {
            city: 'CHI',
            line1: 'No.55'
        },
        secondary: {
            city: 'NYC',
            line1: 'No.777'
        }
    },
    project: proj2
});

test('getter/setter', function () {
    equal(p1.get('name'), 'Tom', 'value getter');
    equal(p1.get('company'), 'NEXT', 'custom getter');

    p1.set('age', 24);
    p1.set('company', 'Google');
    p1.set('address', {
        primary: {
            city: 'BOS',
            line1: 'No.111'
        },
        secondary: {
            city: 'SEA',
            line1: 'No.222'
        }
    });

    equal(p1.get('age'), 24, 'value setter');
    equal(p1.get('company'), 'Google', 'custom setter');
    deepEqual(p1.get('address'), {
        primary: {
            city: 'BOS',
            line1: 'No.111'
        },
        secondary: {
            city: 'SEA',
            line1: 'No.222'
        }
    }, 'complex setter');
});

test('watch/unwatch', function () {
    var n, t , m, f;

    p1.watch('age', function (value) {
        n = value;
    });
    p1.watch('title', function (value) {
        t = value;
    });

    p1.set('age', 25);
    p1.set('title', 'Senior Engineer');

    equal(n, 25, 'watch value setter');
    equal(t, 'Senior Engineer', 'watch custom setter');

    p1.watch('age', f = function (value) {
        m = value;
    });

    p1.set('age', 26);

    ok(n === 26 && m === 26, 'watch multiple setter');

    p1.unwatch('age', f);
    p1.set('age', 27);

    ok(n === 27 && m === 26, 'unwatch setter');

});

test('watch/unwatch path', function () {
    var v1, v2, v3, f1, f2, f3;
    p1.watch('address', f1 = function (value) {
        v1 = value;
    });

    p1.watch('address.primary', f2 = function (value) {
        v2 = value;
    });

    p1.watch('address.secondary.city', f3 = function (value) {
        v3 = value;
    });

    p1.set('address', {
        primary: {
            city: 'SH',
            line1: 'No.aaa'
        },
        secondary: {
            city: 'BJ',
            line1: 'No.bbb'
        }
    });

    deepEqual(v1, {
        primary: {
            city: 'SH',
            line1: 'No.aaa'
        },
        secondary: {
            city: 'BJ',
            line1: 'No.bbb'
        }
    }, 'watch path');

    deepEqual(v2, {
        city: 'SH',
        line1: 'No.aaa'
    }, 'watch path 2');

    equal(v3, 'BJ', 'watch path 3');

    p1.unwatch('address.primary', f2);

    p1.set('address', {
        primary: {
            city: 'SZ',
            line1: 'No.xxx'
        },
        secondary: {
            city: 'NJ',
            line1: 'No.yyy'
        }
    });

    deepEqual(v1, {
        primary: {
            city: 'SZ',
            line1: 'No.xxx'
        },
        secondary: {
            city: 'NJ',
            line1: 'No.yyy'
        }
    }, 'unwatch path');

    deepEqual(v2, {
        city: 'SH',
        line1: 'No.aaa'
    }, 'unwatch path 2');

    equal(v3, 'NJ', 'unwatch path 3');

    var x1, x2, x3;

    p1.watch('project', function (value) {
        x1 = value;
    });

    p1.watch('project.repository', function (value) {
        x2 = value;
    });

    p1.watch('project.repository.name', function (value) {
        x3 = value;
    });

    p1.set('project', proj2);

    equal(x1, proj2, 'watch prop path');
    equal(x2, repo1);
    equal(x3, 'GitHub');

    proj2.set('repository', repo2);

    equal(x1, proj2);
    equal(x2, repo2);
    equal(x3, 'SourceForge');

    repo1.set('name', 'GitHub!');
    repo2.set('name', 'SourceForge!');

    equal(x3, 'SourceForge!');

    proj2.set('repository', repo1);
    equal(x3, 'GitHub!');

    repo1.set('name', 'GitHub');
    repo2.set('name', 'SourceForge');

    p1.set('project', null);
    equal(x3, null);

    p1.set('project', proj2);

    var y;

    proj2.watch('repository.name', function (value) {
        y = value;
    });

    proj2.set('repository', repo2);

    equal(x1, proj2);
    equal(y, 'SourceForge');

    repo2.set('name', 'SourceForge!!');
    equal(y, 'SourceForge!!');

    p1.dispose();
    p1.set('project', proj1);
    repo2.set('name', 'SourceForge');

    equal(x1, proj2);
    equal(x2, repo2);
    equal(x3, 'SourceForge!!');
    equal(y, 'SourceForge');

});