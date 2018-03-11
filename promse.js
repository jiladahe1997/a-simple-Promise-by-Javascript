/*let timeout_start = new Promise(function(resolve,reject){
    var ajaxRequest = new XMLHttpRequest();
    ajaxRequest.onreadystatechange = function(){
        if (ajaxRequest.readyState == XMLHttpRequest.DONE) {
            if (ajaxRequest.status == 200) {
                resolve(ajaxRequest.response);
            }
        }
    }
})

let second = function(){
    return new Promise(function(resolve,reject){
        document.getElementById("test").addEventListener("click",function () {
            alert("clicked!");
            resolve();
        })
    })
}


let third = function(){
    return new Promise(function(resolve,reject){
        document.getElementById("test").addEventListener("focus",function () {
            alert("focus!");
            resolve();
        })
    })
}

timeout_start.then(second).then(third);*/











/* Promise/A+规范有几点需要注意：

    1.then函数不论什么情况都会返回一个新的空函数构建promise对象，因此最终会有n-1个promise对象，每个promise对象的执行队列都只包含下一步的信息

    2.执行队列是一个“单向链表”机构，包含：当前异步操作成功下一步执行的异步函数onFulfilled、失败的异步函数onRejected、指向then返回的下一个新的promise对象的指针next_promise

    3.当resolve触发后，首先会执行执行队列中的 onFulfilled，然后判断返回值 如果是一个promise对象的话，那么将next_promise的执行队列复制到这个新的promise

*/
var count = 0;

//声明类的构造函数
function Promise(init_Function){
    this.name = count++;
    this.state = 0;
    this.execute_query = [];//执行栈/队列
    this.then = function(onFulfilled,onRejected){
        //that = this
        var next_promise = new Promise(function(){});
        //在新建一个对象时，当前this指向会变成新建的对象
        this.execute_query.push(new Handler(onFulfilled,onRejected,next_promise));
        return next_promise //返回这个promise，以供链式调用
    } 

    this.reject = function(){
        throw "asyc execute err!";
    }

    var self = this
    init_Function(function(){resolve(self)},function(){resolve(self)});

    function Handler(onFulfilled,onRejected,next_promise){
        this.onFulfilled = onFulfilled;
        this.onRejected = onRejected;
        this.next_promise = next_promise;
    }

    function resolve(promise){
        //promise.state = 1;
        var next_handler = promise.execute_query.shift();
        var ret = next_handler.onFulfilled();
        var next_promise = next_handler.next_promise;
        //next_promise.state = 3 ;
        doresolve(next_promise,ret);
        //console.log(this);
        //resolve(next_handler.next_promise);
    }

    function doresolve(next_promise,new_promise){
        new_promise.execute_query = next_promise.execute_query;           //复制执行队列到下一个promise
        return
    }
}


//var Promise = require ("./Promise_API3")

function step_1(){
    var p1 = new Promise(function(resolve,reject){   
        //console.log(this);
        //that = this;
        setTimeout(function(){
            console.log("step1");
            //resolve.call(that);
            resolve();
        },3000)
    })
    return   p1;
}
function step_2(resolve,reject){
    //that = this;
    var p2 = new Promise(function(resolve,reject){
        setTimeout(function(){
            console.log("step2");
            resolve();
        },3000)
    })
    return p2;
}
function step_3(resolve,reject){
    var p3 = new Promise(function(resolve,reject){
        setTimeout(function(){
            console.log("step3");
            resolve();
        },3000)
    })
    return p3;
}


var test1 = step_1()
var test2 = test1.then(step_2);
var test3 = test2.then(step_3);
var test4 = 1