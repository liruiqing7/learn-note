# Promis 实例练习

> 本文是围绕`Promise`知识点来编写的由浅入深的练习题。包括:

1. [Promise 基础题](#1.基础题)
2. [Promise 结合 setTimeout](#2.Promise&setTimeout)
3. [Promise 中的 then、catch、finally](#3.then、catch、finally)
4. Promise 中的 all 和 race
5. 持续更新中...

> `event loop` 的执行顺序:

- 一开始整个脚本作为一个宏任务执行。
- 执行过程中同步代码直接执行，宏任务进入宏任务队列，微任务进入微任务队列。
- 当前宏任务执行完出队，检查微任务列表，有则一次执行，直到全部执行完毕。
- 执行浏览器 UI 线程的渲染工作。
- 检查是否有 `Web Worker` 任务，有则执行。
- 执行完本轮的宏任务，回到 2，一次循环，直到宏任务和微任务队列都为空。

##### 微任务包括：

`MutationObserver`、`Promise.then()或catch()` 、`Promise为基础开发的其他技术`、`比如fetch API`、`V8`的垃圾回收过程、`Node独有的process.nextTick`。

##### 宏任务包括：

`script`、`setTimeout`、`setInterval`、`I/O`、`UI rendering`。

注意 ⚠️ ：在所有任务开始的时候，由于宏任务中包括了`script`，所以浏览器会先执行一个宏任务，在这个过程中你看到的延迟任务（例如 `setTimeout`） 将被放到下一轮宏任务中执行。

### 1.基础题

```js
const promise1 = new Promise((resolve, reject) => {
  console.log("promise1");
  resolve("resolve1");
});
const promise2 = promise1.then((res) => {
  console.log(res);
});
console.log("1", promise1);
console.log("2", promise2);
/*
  过程分析

  * 从上至下，先遇到 new Promise,执行该构造函数中那个的代码promise1
  * 碰到 resolve函数，将promise1 的状态改变为 resolved，并将结果保存下来
  * 碰到 promise1.then这个微任务，将它放入微任务队列
  * promise2 是一个新的状态为pending的Promise
  * 执行同步代码1，同时打印出promise1的状态是resolved
  * 执行同步代码2，同事打印出promise2的状态是pending
  * 宏任务执行完毕，查找微任务队列，发现promise1.then这个微任务且状态为resolved，执行。
*/


结果：
'promise1'
'1' Promise{<resolved>: 'resolve1' }
'2' Promise{<pending>}
'resolve1'
```

```js
const fn = () =>
  new Promise((resolve, reject) => {
    console.log(1);
    resolve("success");
  });
console.log("start");
fn().then((resolve) => {
  console.log(resolve);
});
  //new Promise()并不是在所有情况下都是立即执行的,如果他被函数包裹，就只有在函数调用的情况下才会执行。

结果：
'start'
1
'success'
```

### 2.Promise&setTimeout

```js
const promise = new Promise((resolve, reject) => {
  console.log(1);
  setTimeout(() => {
    console.log("timerStart");
    resolve("success");
    console.log("timerEnd");
  }, 0);
  console.log(2);
});
promise.then((res) => {
  console.log(res);
});
console.log(4);

/*
  过程分析：

  * 自上而下，首先执行构造函数，打印出 1 。
  * 执行到setTimeout，将定时器放入下一个宏任务的队列中等待执行
  * 执行同步代码 打印出 2 。
  * 跳出 Promise函数，此时，Promise.then的状态仍为pending，所以不会执行。
  * 执行同步代码 打印出 4 。
  * 一轮循环过后，开始执行第二轮宏任务，执行setTimeout。
  * 打印 timerStart,将Promise的状态置为success,打印 timerEnd。
  * 宏任务全部执行完毕，开始执行微任务 promise.then方法，打印出res的值，success。
*/

结果：

  1
  2
  4
  'timerStart'
  'timerEnd'
  'success'
```

```js
Promise.resolve().then(() => {
  console.log("promise1");
  const timer2 = setTimeout(() => {
    console.log("timer2");
  }, 0);
});
const timer1 = setTimeout(() => {
  console.log("timer1");
  Promise.resolve().then(() => {
    console.log("promise2");
  });
}, 0);
console.log("start");

/*
过程分析：
自上而下，首先整个脚本作为第一个宏任务来执行
遇到Promise.resolve().then()作为宏1的微任务放入队列
遇到定时器 timer1 作为宏2任务放入队列
执行同步代码打印出start。
宏1执行完毕，执行宏1微任务打印出promise1，遇到定时器timer2，放入宏2的后面
执行宏2（timer1）打印从同步代码timer1，执行宏二中微任务 打印promise2
执行宏3 (timer2) 打印timer2
*/

结果：

'start'
'promise1'
'timer1'
'promise2'
'timer2'
```

```js
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("success");
  }, 1000);
});
const promise2 = promise1.then(() => {
  throw new Error("error!!!");
});
console.log("promise1", promise1);
console.log("promise2", promise2);
setTimeout(() => {
  console.log("promise1", promise1);
  console.log("promise2", promise2);
}, 2000);

/*
过程分析：
  首先执行构造函数 promise1，其中遇到定时任务 setTimeout，将其放入下一个宏任务列表中
  执行 promise2, 此时promise1的状态暂为pending，并且promise2是一个新的promise并且状态为pending
  打印，‘promise1’，promise1的状态为pending
  打印，‘promise2’，promise2的状态为pending
  遇到第二个定时任务，排在宏任务2的后面，开始执行宏2
  执行第一个定时任务，将promise1的状态改成resolve且保存结果并将之前的promise1.then推入微任务列表
  该定时器没有同步任务，所以执行本轮微任务队列promise2，他抛出了一个错误，且将promise2的状态置为reject
  第一个定时器执行完毕开始执行第二个定时器中的内容
  打印promise1，且此时promise1的状态为resolve
  打印promise2，且此时promise2的状态为reject
*/

结果：
'promise1',promise{<pending>}
'promise2',promise{<pending>}
 Error:error!!!
'promise1',promise1{<success>}
'promise2',promise2{<reject>:Error:'error!!!'}

```

```js
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("success");
    console.log("timer1");
  }, 1000);
  console.log("promise1里的内容");
});
const promise2 = promise1.then(() => {
  throw new Error("error!!!");
});
console.log("promise1", promise1);
console.log("promise2", promise2);
setTimeout(() => {
  console.log("timer2");
  console.log("promise1", promise1);
  console.log("promise2", promise2);
}, 2000);

/*
执行promise1，遇到定时器任务，放入下一个宏任务执行队列中。执行同步任务console。
执行promise2,此时promise1的状态为pending，暂时不执行。
执行宏1任务中的同步任务，开始打印promise1，状态为pending，打印promise2,状态为pending。
遇到第二个定时任务，将它排在宏2后，作为宏3处理。且开始执行宏2。
将promise1置为resolve，打印timer1.并且执行promise2中的promise1.then()推入微任务队列。


*/

结果：
  'promise1里的内容'
  ’promise1‘,promise{<pending>}
  'promise2',promise{<pending>}
  'timer1'
  Error:'error!!!'
  'timer2'
  'promise1',promise{<resolved>:'success'}
  'promise2',promise{<rejected>:Error:error!!!}

```

##总结一下：

1. promise 的状态的变更是单向的且不可逆转的。
2. .then 和 .catch 都会返回一个新的 Promise。
3. .catch 不管被放在哪里，都能捕获上层未捕获到的错误，已经被上层捕获的则不会捕获。
4. 在 Promise 中，返回任意一个非 promise 的值都会被包裹成 promise 对象,例如 return 2 会被包装成 return Promise.resolve(2)。
5. Promise 的 .then 或者 .catch 可以被调用很多次，但如果 Promise 内部的状态已经改变，并且有值，那么后续调用.then 或者.catch 都会直接拿到改值。
6. .then 或者 .catch 中 return 一个 error 对象并不会抛出错误，所以不会被后续的.catch 捕获到。
7. .then 或 .catch 返回的值不能是 promise 本身，否则会造成死循环。
8. .then 或 .catch 的参数期望是函数，传入非函数则会发生值透传。
9. .then 方法是能接收两个参数的，第一个是处理成功的函数，第二个是处理失败的函数，在某些时候你可以任务 catch 是.then 第二个参数的简便写法。
10. .finally 方法也是返回一个 Promise，他在 Promise 结束的时候，无论结果为 resolved 还是 rejected，都会执行里面的回调函数。

### 3.then、catch、finally

```js
const promise = new Promise((resolve, reject) => {
  reject("error");
  resolve("success");
});

promise
  .then((res) => {
    console.log("then1:", res);
  })
  .then((res) => {
    console.log("then2:", res);
  })
  .catch((err) => {
    console.log("catch:", err);
  })
  .then((res) => {
    console.log("then3:", res);
  });

  结果：
  'catch:''error'
  'then3:' undefined

  //catch不论链接到哪里，都能捕获上层未捕捉过的错误。then3也会被执行，
  //是因为catch()也会返回一个Promise，且由于这个Promise没有返回值，所以打印出来的undefined。
```

```js
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log("timer");
    resolve("success");
  }, 1000);
});
const start = Date.now();
promise.then((res) => {
  console.log(res, Date.now() - start);
});
promise.then((res) => {
  console.log(res, Date.now() - start);
});

/*
  过程分析：
  Promise 的 .then 或者 .catch 可以被调用多次，但是Promise构造函数只执行一次。
  或者说，promise的内部状态一经改变，并且有了值，那么后续每次调用.then 或者 .catch 都会直接拿到该值。
*/

结果：

'timer'
'success' 1001
'success' 1002
```

```js
Promise.resolve()
  .then((res) => {
    return new Error("error!!!");
  })
  .then((res) => {
    console.log("then:", res);
  })
  .catch((res) => {
    console.log("catch:", res);
  });

/*
    过程分析：
    上面这个🌰 将会执行第二个.then中的内容。
    输出结果为： then: Error: error!!!
    这证明，返回任意一个非promise的值，都会被包裹成promise对象.
    因此，这里的 `return new Error('error!!!')`,被包裹为，`return promise.resolve(new Error('error!!!'))`。
    如果希望promise抛出一个错误，可以选择以下两种方式：
    1. return Promise.reject(new Error('error!!!'))
    2. throw new Error('error!!!')
  */
```

```js
Promise.reject("err!!!")
  .then(
    (res) => {
      console.log("success", res);
    },
    (err) => {
      console.log("error", err);
    }
  )
  .catch((err) => {
    console.log("catch", err);
  });

/*
  执行结果：
  'error' 'err!!!'

  过程分析：
  上面🌰 中Promise.reject()进入处理失败的函数，但它没有进入.catch()。
  这是因为.then()方法有两个参数，第一个参数处理成功的函数，第二个是处理失败的函数。
  如果去掉.then()的第二个参数，就进入了.catch()中。
  */
```

```js
function promise1() {
  let p = new Promise((resolve) => {
    console.log("promise1");
    resolve("1");
  });
  return p;
}

function promise2() {
  return new Promise((resolve, reject) => {
    reject("error");
  });
}

promise1()
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    console.log("finally1");
  });
promise2()
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    console.log("finally2");
  });

/*
  过程分析：
  首先定义两个函数，promise1和promise2.
  执行promise1打印同步代码'promise1',将promise1的状态改为resolve,因此将promise1.then()加入微任务列表。
  此时，代码并不会接着往链式调用的下面走，也就是不会讲finally加入微任务列表，因为.then本身就是一个微任务，他链式后面的内容必须等当前这个微任务执行完才能执行。
  执行promise2，其中没有需要执行的同步代码，因此执行reject('error')将promise2函数中Promise的状态置为rejected。
  跳出promise2,执行到promise2.catch(),将其加入微任务队列（这是第二个微任务），且链式调用后面的内容得等到改任务执行完之后才会执行，和.then()一样。
  本轮宏任务执行完毕，开始执行微任务列表，执行promise1.then(),打印出 '1'，遇到finally()，将它放入微任务列表（这是第三个微任务队列）等待执行。
  再来执行promise2().catch()，打印出error,执行完后将finally加入微任务列表（这是第四个微任务）
  本轮微任务执行完毕，执行微任务列表中剩下的finally1和finally2。

  执行结果：
  'promise1'
  '1'
  'error'
  'finally1'
  'finally2'
  */
```
