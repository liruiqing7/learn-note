# Promis 实例练习

> 本文是围绕`Promise`知识点来编写的由浅入深的练习题。包括:

1. [Promise 基础题](#基础题)
2. Promise 结合 setTimeout
3. Promise 中的 then、catch、finally
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
```
