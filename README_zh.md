LineJS
======

## 浏览器支持

* Internet Explorer 6+
* Chrome
* Safari
* Firefox
* Opera

## 核心库
LineJS的核心库**(line-base.js)**的设计哲学是对JavaScript的运行时本身进行增强，因此有着**平台无关**的特性。
也就是说，它既可以运行在**客户端（如浏览器）**也可以运行在**服务器端（如nodejs）**.
核心库实现了一套功能强大的 面向对象（OOP）机制，十分适合复杂的应用。
同时也提供了一组内建方法，既能用于JavaScript的原生对象，也能用于LineJS定义的类对象。
除此之外，核心库十分轻量。

### 内建方法

#### extend
`line.extend(target, source, [source1,...])`
> 将对象的属性添加到目标。

#### each 
`line.each(target, callback, [context])`
> 迭代目标并执行迭代方法。

#### clone
`line.clone(target)`
> 复制目标。

#### type
`line.type(target)`
> 获取目标的类型。

#### is
`line.is(target, type)`
> 检测目标是否为指定的类型。

#### has
`line.has(target, key)`
> 检测目标是否有指定的属性。

#### get
`line.get(target, name)`
> 获取目标的指定的属性值。

#### set
`line.set(target, name, value)`
> 设置目标的指定的属性值。

#### gets
`line.gets(target)`
> 获取目标的所有属性值。

#### sets
`line.sets(target, dict)`
> 批量设置目标的属性值。

#### compare
`line.compare(target, source)`
> 比较目标和源。

#### path
`line.path(target, path, value)`
> 以路径的方式获取或设置目标的属性值。

#### invoke
`line.path(target, path, args)`
> 以路径的方式执行目标的方法。

### 使用面向对象（OOP）

LineJS中面向对象的实现非常类似于Java/C#，支持事件、属性、方法和继承等等。

#### 定义一个类

`line.define([base], members)`

> **base** 参数是需要继承的父类。
> **members** 参数是类的成员（事件/属性/方法等）。

#### 事件

```javascript
var MyClass = line.define({
  events: ['myevent', 'anotherevent']
});

var a = new MyClass();
a.on('myevent', function(sender, event){
  alert('myevent triggers');
});
```

> 调用 `instance.on(name, handler, context)` 来添加一个事件处理。
> 调用 `instance.off(name, handler, context)` 来移除一个事件处理。
> 调用 `instance.fire(name, data)` 来激发一个事件。
> 在支持Object.defineProperty的浏览器下(IE 9+)，可以使用 
> instance.oneventname = function (sender, event) {...} 的形式添加一个事件处理，该方式与
> instance.on('eventname', function (sender, event) {...})等价

#### 属性

```javascript
var MyClass = line.define({
  properties: {
    prop1:{
      value: 0
    },
    prop2:{
      value: 'this is a readonly value',
      readonly: true
    }
  }
});
```

> 调用 `instance.get(name)` 来获取一个属性值。
> 调用 `instance.set(name, value)` 来设置一个属性值。
> 在支持Object.defineProperty的浏览器下(IE 9+)，可以使用 
> value = instance.name的形式获取属性值或用instance.name = value的形式设置属性值。

#### 方法

```javascript
var MyClass = line.define({
  methods: {
    myMethod: function() {
      console.log('This is a method');
    },
    anotherMethod: function(param) {
      console.log('The param is ' + param);
    }
  }
});
```

#### 继承

```javascript
var MyParentClass = line.define({
  events: ['myEvent'],
  properties: {
    myProp: {
      value: 0
    }
  },
  methods: {
    sayHello: function(name) {
      console.log('hello' + name);
    }
  }
});

var MyChildClass = line.define(MyParentClass, {
  properties: {
    myProp: {
      value: 100
    }
  },
  methods: {
    sayHello: function(name) {
      this.inherited(name.toUpperCase());
    },
    sayGoodbye: function() {
      console.log('Goodbye!');
    }
  }
});
```

> 你可以定义一个继承自某个父类的类，所有父类的成员（事件/属性/方法）都会被继承。
> 你可以用同名的成员来覆盖某个父类成员。当方法被覆盖时，你可以用`this.inherited([params])`来调用父类的方法。


#### 静态类

```javascript
var MyStaticClass = line.define({
  static: true
});
```

> 静态类的所有成员（事件/属性/方法）都会被直接添加到类上。

#### 动态修改类

> 调用`MyClass.defineEvent(name, meta)`为类增加一个事件成员。
> 调用`MyClass.defineProperty(name, meta)`为类增加一个成员属性。
> 调用`MyClass.defineMethod(name, meta)`为类增加一个成员方法。

## Client库
\* Under Construction

## Server库
\* Under Construction