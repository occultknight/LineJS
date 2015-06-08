
LineJS
======

LineJS is a well-structured, layered javascript framework for both client and server.

## LineJS Core

### Builtin functions
LineJS implemented a bunch of commonly used functions which could be applied on both LineJS objects
and native Javascript objects.

#### extend
`line.extend(target, source, [source1,...])`
> Extends the **target** with properties from source

#### each 
`line.each(target, iterator, [context])`
> Iterate over the **target** array/object and execute the **iterator** function.

#### clone
`line.clone(target)`
> Clone the **target** Object/Array.

#### type
`line.getType(target)`
> Get the type of **target**.

#### is
`line.is(target, type)`
> Check whether **target** is specified type.

#### may
`line.is(target, type)`
> Check whether **target** support specified event.

#### can
`line.is(target, type)`
> Check whether **target** has specified method.

#### has
`line.has(target, key)`
> Check whether **target** has specified property.

#### get
`line.has(target, key)`
> Get the property value of **target** specified by **key**.

#### set
`line.override(target, key, value)`
> Set the property value of **target** specified by **key**.

#### gets
`line.has(target)`
> Get all property values of **target**.

#### sets
`line.override(target, dict)`
> Batch set property values of **target**.

#### compare
`line.compare(target, source)`
> Compare **target** and **source**.

#### path
`line.path(target, path, value)`
> Get or set the property value of **target** according to the **path**.

#### invoke
`line.invoke(target, path, args)`
> Invoke the method of **target** according to the **path**.

### Module system
LineJS implemented a module system which is very useful in complicated projects.

#### declare a module

`line.module({object})`

You can define a module which contains a Javascript object. This is useful when defining a config file or data file.

`line.module(function(){...})`

You can define a module using a factory function, and the return value will be used as the module's value.

`line.module([dependencies],function(){...})`

Use an array of paths to specify the dependencies. After all dependent modules are resolved the factory function will
be executed.

#### load a module
`line.load(path,callback)`

You can load a module by path and specify a callback which will be executed after module is loaded.
Most dependent modules are loaded and cached automatically, so typically you just need to load the main module manually.

### OOP mechanism

The OOP implementation in LineJS is very alike to Java/C# which support events, properties, methods and inheritance, etc.

#### Defining a class

`var MyClass = line.define([baseClass], [members])`

> **baseClass** param is the base Class you want to inherit from.
> **members** param is the members you the Class owns. A member can be an event, an property or a method.

#### Declaring Events

You can define event members in an array.

```javascript
line.define({
  events: ['myEvent', 'anotherEvent']
});

var a = new ClassA();
a.on('myEvent', function(sender, args){
  alert('myEvent triggers');
});
```

> Use `instance.on(eventName, handler, context)` to add an event handler.
> Use `instance.off(eventName, handler, context)` to remove an event handler.
> Use `instance.fire(eventName, args)` to trigger an event.

#### Declaring Properties

```javascript
line.define({
  properties: {
    property: 'hello',
    myProperty:{
      value: 0
    },
    myReadonlyProperty:{
      value: 'this is a readonly value',
      readonly: true
    }
  }
});
```

> Use `instance.get(propName)` to get a property value.
> Use `instance.set(propName, value)` to set a property value.
> When a property is marked as **readonly**, it cannot be set except in the **init** method.

#### Declaring Methods

```javascript
line.define({
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

#### Inheritance

```javascript
var ParentClass = line.define({
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

line.define(ParentClass, {
  properties: {
    myProp: {
      value: 100
    }
  },
  methods: {
    sayHello: function(name) {
      this.base(name.toUpperCase());
    },
    sayGoodbye: function() {
      console.log('Goodbye!');
    }
  }
});
```

> You can define a class which is inherited from another class. All the members (events/properties/methods) would be inherited.
> You can override a member by using the same member name in the child class. When a method member was overriden, you can call `this.base([params])` to call the method in parent class.

#### Builtin instance methods
`init()`
> Initialize the instance

`dispose()`
> Dispose the instance. Usually called by system

`destroy()`
> Destroy the instance. Usually called by developer

`base()`
> Call overridden method from base class

`is(type)`
> Check whether current instance is specified type

`member()`
> Get the specified member

`may(name)`
> Check whether current instance has specified event

`has(name)`
> Check whether current object has specified property

`can(name)`
> Check whether current object has specified method

`get(name, [options])`
> Get specified property value

`set(name, value, [options])`
> Set specified property value

`gets([options])`
> Get all properties

`sets(obj, [options])`
> Set a bunch of properties

`on(name, handler, [options])`
> Add an event handler

`off(name, handler, [options])`
> Remove an event handler

`fire(name, handler, [options])`
> Trigger an event

#### Builtin class methods
`getMeta(name)`
> Get the meta data of the class

`setMeta(name, value)`
> Get the meta data of the class

`defineEvent(name, meta, [target])`
> Define an event

`defineProperty(name, meta, [target])`
> Define a property

`defineMethod(name, meta, [target])`
> Define a method


