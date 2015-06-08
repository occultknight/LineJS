LineJS 代码规范
==============

# 目录
1. 源文件(src)目录只包含一层子目录，目录名为模块名。如：`http`

# 文件名
1. 类文件：只定义一个类的文件必须必须与类名一致，单词首字母大写。如：`MyClass.js`
2. 模块文件：定义多个类的文件表示一个模块，所有字母小写，单词之间用下划线分割。如：`my_module.js`
3. 对象文件：定义一个对象的文件，规范同“模块文件”。如：`my_config.js`

# 语句
1. 所有语句单独一行。
2. if/while/for等表达式必须带花括号并且换行。

# 变量
1. 模块变量：模块变量须与模块文件名一致。如：`module(['./MyClass', 'my_module'],function() {MyClass, my_module})`
2. 闭包变量：闭包变量采用驼峰式命名。如：`var myValue`
3. 方法参数：方法参数采用驼峰式命名。如：`function (param, args)`
4. 局部变量：方法内的局部变量采用下划线加驼峰式命名。如：`var _myVar`

# 方法
1. 公有方法：公有方法采用驼峰式命名。如：`myPublicMethod: function()`
2. 私有方法：私有方法采用双下划线加驼峰式命名。如：`__myPrivateMethod: function()`

# 类
1. 类元数据的顺序：mixins->partial->static->statics自定义元数据->events->view->properties->methods
2. 框架内的属性访问器统一使用get/set
3. 属性元数据的顺序：value->readonly->get->set->自定义元数据