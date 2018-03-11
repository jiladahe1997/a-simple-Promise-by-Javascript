# a simple Promise by Javascript

一个简单的promise：[https://github.com/jiladahe1997/a-simple-Promise-by-Javascript/blob/master/promise_simple.js](https://github.com/jiladahe1997/a-simple-Promise-by-Javascript/blob/master/promise_simple.js)

思路与Promise/A+一样的promise：[https://github.com/jiladahe1997/a-simple-Promise-by-Javascript/blob/master/promise.js](https://github.com/jiladahe1997/a-simple-Promise-by-Javascript/blob/master/promise.js)

官方Promise/A+规范：[https://github.com/then/promise](https://github.com/then/promise)

# 开头

什么是promise？

假设现在需要你：<br>
1.通过JavaScript通过ajax请求获取数据，<br>
2.然后将获取到的数据放到一个指定的div里面去。<br>

用代码实现：
``` javascript
var ajaxRequest = new XMLHttpRequest();
ajaxRequest.onreadystatechange = function(){
    if(ajaxRequest.readyState == XMLHttpRequest.DONE){
        if(ajaxRequest.status == 200){
            var ajax_data = ajaxRequest.response;
            var target_div = document.getElementById("test");
            target_div.innerHTML = ajax_data;
        }
    }
}
ajaxRequest.open("get","./test")
ajaxRequest.send();
```

嗯...上面的代码好像有点复杂，看明白第一步和第二步在哪里需要花费至少3分钟时间...这主要是由于这种**异步**操作的特殊性，下一步操作必须嵌套在上一步操作的回调函数中。一旦异步操作多起来，例如：

``` javascript
下班(function(){
  setTimeout(function(){
    搭车(function(){
       setTimeout(function(){
         接小孩(function(){
           setTimeout(function(){
             回家(); 
           },  20*60*1000);
         });
       },  10*60*1000);
    });
  }, 10*60*1000);
});

```

这下看起来耦合性更高了，如果是自己写的代码还好，要是看别人的代码这样，估计已经看不下去了。

如果使用promise的话就会是这样：
``` javascript
下班.then(搭车).then(接小孩).then(回家)
```
<br>
<br>
<br>

# Promise

上面这种通过then的方式来实现异步回调，就叫做Promise。

Promise实质是一个手动实现的对象。可以将异步函数通过Promise的构造函数，构造成一个新的promise对象。

举例：
``` javascript
var promise_1 = new Promise(function(resolve,reject){
    setTimeout(functon(){
        console.log("1");
        resolve();
    },1000)
})
```

然后就可以通过 *then* 函数链式的调用。

由于Promise是手动实现的对象，因此就有很多种不同的实现，其中使用最广泛的 *Promises/A+* 标准。

在Promise/A+ 标准中，新建一个promise对象的操作和上面一样，再使用then函数时则可以分为以下几种情况：

		• 如果then中的回调函数返回一个值，那么then返回的Promise将会成为接受状态，并且将返回的值作为接受状态的回调函数的参数值。
		• 如果then中的回调函数抛出一个错误，那么then返回的Promise将会成为拒绝状态，并且将抛出的错误作为拒绝状态的回调函数的参数值。
		• 如果then中的回调函数返回一个已经是接受状态的Promise，那么then返回的Promise也会成为接受状态，并且将那个Promise的接受状态的回调函数的参数值作为该被返回的Promise的接受状态回调函数的参数值。
		• 如果then中的回调函数返回一个已经是拒绝状态的Promise，那么then返回的Promise也会成为拒绝状态，并且将那个Promise的拒绝状态的回调函数的参数值作为该被返回的Promise的拒绝状态回调函数的参数值。
		• 如果then中的回调函数返回一个未定状态（pending）的Promise，那么then返回Promise的状态也是未定的，并且它的终态与那个Promise的终态相同；同时，它变为终态时调用的回调函数参数与那个Promise变为终态时的回调函数的参数是相同的。
            >来自 <https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/then> 


其中最常见的最后一种情况，返回一个未定状态的promise，像这样：
``` javascript
function promise_2(){
    return new Promise(function(resolve,reject){
        setTimeout(function(){
            console.log("2")
            resolve();
        },1000)
    })
}
promise_1.then(promise_2)
```
之所以要这样写，原因是在使用一个异步函数新建一个promise时，在新建过程中就会运行一遍这个异步函数。比如之前上面那个新建promise1的过程：
``` javascript
var promise_1 = new Promise(function(resolve,reject){
    setTimeout(functon(){
        console.log("1");
        resolve();
    },1000)
})
// 在新建promise后就会运行一遍异步函数，因此1000毫秒后就会输出"1"
```

<br>
<br>
<br>

# 一个简单的Promise

以上，你可能已经大致的了解了什么叫做Promise，然而，如果你还有一脸疑惑，那也没关系，看了下面你一定就会更加清晰了。

Promise对象的实质是 **有限状态机** ，下面就实现一个 简单但并不完善的Promise
``` javascript
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
```

以上就是一个没有遵循Promise/A+规范，缺乏错误处理的简单promise实现。

不难看出，promise其实只是一种 “语法糖”，将异步函数放在一个执行队列里面，执行完一个再执行下一个。

<br>
<br>
<br>

# Promise/A+ 规范

正如以上所说，Promise的实现完全是手工构建的一个对象，因此需要一个规范来让大家的Promise都相同。

下面是一个思路遵循Promise/A+规范的实现。