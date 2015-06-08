line.module(['core','util'], function (core, util) {
    //string:
    console.log(util.StringUtil.repeat('*', 12));
    console.log('hellow line');
    console.log(util.StringUtil.repeat('*', 12));

    //array:
    var arr=[1,2,3];
    var index=util.ArrayUtil.indexOf(arr,3);
    console.log(index);

});
