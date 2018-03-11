/*    简单的Promise对象声明    */
function Promise(fn){
    this.execute_query = []    //执行队列，每次then操作注册的函数放在这里面，当上一个异步函数执行完后，就执行队列中的下一个函数

    function resolve(){
        var next_fn = this.execute_query.shift();
        if (next_fn == undefined) {
            return
        }
        next_fn(resolve.bind(this),reject.bind(this)); //执行队列中的下一个function
    }
    function reject(){
        throw "reject!"
    }

    fn(resolve.bind(this),reject.bind(this)) //构造完后立即执行异步函数，同时由于setTimeout回调函数调用resolve时的默认对象是 window， 这里手动绑定为 promise
}
Promise.prototype.then = function(next_fn){
    this.execute_query.push(next_fn);
    return this
}
/*  Promse对象声明结束    */



/*  将异步函数封装        */
var promise_1 = new Promise(function(resolve,reject){
    setTimeout(function(){
        console.log("1");
        resolve();
    },3000)
})
var promise_2 = function(resolve,reject){
    setTimeout(function(){
        console.log("2");
        resolve();
    },3000)
}

var promise_3 = function(resolve,reject){
    setTimeout(function(){
        console.log("3");
        resolve();
    },3000)
}
/*  异步函数封装完毕    */



promise_1.then(promise_2).then(promise_3)