line.module([
    'core',
    'data',
    'ui',
    './style.css'
], function (core, data, ui) {

    var User = line.define(core.Observable, {
        properties: {
            male: {
                get: function () {
                    return this._male;
                },
                set: function (value) {
                    this._male = value;
                    this.notify('fullName');
                }
            },
            firstName: {
                get: function () {
                    return this._firstName;
                },
                set: function (value) {
                    this._firstName = value;
                    this.notify('fullName');
                }
            },
            lastName: {
                get: function () {
                    return this._lastName;
                },
                set: function (value) {
                    this._lastName = value;
                    this.notify('fullName');
                }
            },
            fullName: {
                get: function () {
                    return (this._male ? 'Mr. ' : 'Mrs. ') + this._firstName + ' ' + this._lastName;
                }
            },
            color: {
                value: '#666'
            }
        },
        methods: {
            init: function (data) {
                this._male = true;

                this.base();
                this.sets(data);
            },
            hello: function () {
                alert('hello,' + this.get('fullName'));
            }
        }
    });

    var mars = new User({
        firstName: 'Mars',
        lastName: 'Wu',
        color: '#800000'
    });

    var fei = new User({
        firstName: 'Fei',
        lastName: 'Zheng'
    });

    var kai = new User({
        firstName: 'Kai',
        lastName: 'Liu'
    });

    var abu = new User({
        firstName: 'Abu',
        lastName: 'Aikepaer'
    });

    var wei = new User({
        firstName: 'Wei',
        lastName: 'Qiao'
    });

    var bao = new User({
        firstName: 'XiaoBao',
        lastName: 'Shi'
    });

    var col = new data.ObservableCollection([mars, kai, fei]);

    var dict = new data.ObservableDictionary({
        site: 'Site Name',
        node: 'Node Name',
        interface: 'Interface Name'
    });

    var MyPanel = line.define(ui.View, {
        events: ['panel.click'],
        view: {
            $tag: 'div',
            class: 'panel',
            $content: {
                $tag: 'button',
                events: {
                    click: '{#onClick}'
                },
                $content: 'MyPanelButton'
            }
        },
        methods: {
            onClick: function () {
                console.log('onClick');
                this.fire('panel.click');
            }
        }
    });

    var MyParagraph = line.define(ui.View, {
        view: {
            $tag: 'p',
            'class': 'paragraph',
            style: {
                maxWidth: '30%',
                position: 'relative',
                zIndex: 5
            },
            $content: '{#message}'
        },
        properties: {
            message: {
                value: {
                    $tag: 'span',
                    $content: 'paragraph'
                }
            }
        }
    });

    var MyInlineView = line.define(ui.View, {
        alias: 'MyInlineView',
        properties: {
            title: 'Users',
            legend: 'User',
            items: null
        },
        methods: {
            init: function () {
                this.base();
                this.set('items', col);
            },
            showName: function (data) {
                alert(data.get('fullName'));
            },
            toUpper: function (value) {
                return value && value.toUpperCase();
            }
        }
    });


    var MyComp = line.define(ui.View, {
        view: [
            {
                $tag: 'p',
                $content: {
                    $tag: 'span',
                    $content: [
                        {
                            $name: 'a',
                            $tag: 'a',
                            href: '#',
                            $content: 'hello'
                        },
                        {
                            $tag: 'i',
                            $content: 'world'
                        }
                    ]
                }
            },
            {
                $type: MyPanel,
                events: {
                    'panel.click': '{#onPanelClick}'
                },
                $content: {
                    $type: MyParagraph
                }
            },
            {
                $tag: 'ul',
                $name: 'ul',
                $content: {
                    $type: 'line:List',
                    items: '{#items}',
                    $content: [
                        {
                            $tag: 'li',
                            'class': 'a b c',
                            style: 'color:red;font-weight:bold',
                            $content: {
                                $tag: 'input',
                                value: '{firstName}'
                            }
                        },
                        {
                            $tag: 'li',
                            'class': ['xx', '{firstName}', 'y'],
                            style: {
                                color: 'blue',
                                'font-size': '12px'
                            },
                            $content: 'lastName'
                        },
                        {
                            $tag: 'li',
                            style: {
                                color: '{color}',
                                'font-family': 'consolas'
                            },
                            $content: '{fullName,converter=toUpper}'
                        }
                    ]
                }
            },
            {
                $tag: 'dl',
                $content: {
                    $type: 'line:List',
                    items: '{#dict}',
                    $content: [
                        {
                            $tag: 'dt',
                            $content: '{key}'
                        },
                        {
                            $tag: 'dd',
                            $content: '{value}'
                        }
                    ]
                }
            },
            {
                $tag: 'ul',
                $content: [
                    {
                        $type: 'line:List',
                        items: [
                            {label: 'a'},
                            {label: 'b'},
                            {label: 'c'}
                        ],
                        $content: {
                            $tag: 'li',
                            $content: '{label}'
                        }
                    },
                    {
                        $type: 'line:List',
                        items: [
                            {label: 'x'},
                            {label: 'y'},
                            {label: 'z'}
                        ],
                        $content: {
                            $tag: 'li',
                            $content: '{label}'
                        }
                    },
                    {
                        $type: 'line:List',
                        $content: {
                            $type: 'line:List',
                            items: '{items}',
                            $content: [
                                {
                                    $tag: 'li',
                                    $content: '{label}'
                                },
                                {
                                    $tag: 'li',
                                    $content: {
                                        $tag: 'button',
                                        events: {
                                            click: '{#onClick}'
                                        },
                                        $content: '{#test}'
                                    }
                                }
                            ]
                        },
                        items: [
                            {
                                items: [
                                    {
                                        label: 'aa'
                                    },
                                    {
                                        label: 'bb'
                                    },
                                    {
                                        label: 'cc'
                                    }
                                ]
                            },
                            {
                                items: [
                                    {
                                        label: 'xx'
                                    },
                                    {
                                        label: 'yy'
                                    },
                                    {
                                        label: 'zz'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                $name: 'btn',
                $tag: 'button',
                events: {
                    click: '{#onClick}'
                },
                $content: 'click me'
            },
            {
                $tag: 'svg:svg',
                $content: [
                    {
                        $tag: "svg:rect",
                        width: '100px',
                        height: '100px',
                        fill: '#800000'
                    }
                ]
            }
        ],
        properties: {
            items: null,
            dict: null,
            test: 'TEST'
        },
        methods: {
            init: function () {
                this.base();
                console.log(this.resolve('a'));
            },
            onClick: function (data) {
                console.log('onClick', data);
                console.log(this.resolve('a'));
            },
            toUpper: function (value) {
                return value && value.toUpperCase();
            },
            onPanelClick: function () {
                console.log('onPanelClick');
            }
        }
    });

    var App = line.define(ui.Application, {
        methods: {
            start: function () {
                this.base();
                var comp = new MyComp();
                comp.set('items', col);
                comp.set('dict', dict);
                comp.attach(this);

                comp.on('click', function () {
                    console.log('comp click');
                });

                setTimeout(function () {
                    col.add(wei);
                }, 2000);

                setTimeout(function () {
                    comp.resolve('btn').fire('click');
                }, 4000);
            }
        }
    });

    (new App).start();
});