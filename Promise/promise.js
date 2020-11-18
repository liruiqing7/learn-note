// Promise 是一个类，由于 new Promise((resolve,reject)=>{})，所以传入一个executor,传入就执行。
// then -> Promise 有一个叫做then 的方法，它有两个参数，onFulfilled,onRejected,成功则储存成功的值，失败则抛出失败的原因。
class Promise {
  // 构造器
  constructor(executor) {
    // 初始化state为等待状态
    this.state = "pending";
    // 成功的值
    this.value = undefined;
    // 失败的原因
    let resolve = (value) => {
      // state改变,resolve调用就会成功
      if (this.state === "pending") {
        // resolve调用后，state转化为成功态
        this.state === "fulfilled";
        // 储存成功的值
        this.value = value;
        // 一旦resolve执行，调用成功数组的函数
        this.onResolveCallbacks.foreach((fn) => fn());
      }
    };
    let reject = (reason) => {
      // state改变，reject调用就会失败
      if (this.state === "pending") {
        // reject 调用后，state转化为失败态
        this.state = "rejected";
        // 储存失败的原因
        this.reason = "rejected";
        // 一旦reject执行，调用失败数组的函数
        this.onRejectedCallbacks.foreach((fn) => fn());
      }
    };
    // 如果executor 执行报错，直接执行reject
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }
  then(onFulfilled, onRejected) {
    // 声明返回的promise2
    let promise2 = new Promise((resolve, reject) => {
      if (this.state === "fulfilled") {
        let x = onFulfilled(this.value);
        // resolvePromise 函数，处理自己return的promise和默认的promise2的关系
        resolvePromise(promise2, x, resolve, reject);
      }
      if (this.state === "rejected") {
        let x = onRejected(this.reason);
        resolvePromise(promise2, x, resolve, reject);
      }
      // 当状态state为pending时
      if (this.state === "pending") {
        // onFulfilled 传入到成功数组
        this.onResolvedCallbacks.push(() => {
          let x = onFulfilled(this.value);
          resolvePromise(promise2, x, resolve, reject);
        });
        // onRejected 传入到失败数组
        this.onRejectedCallbacks.push(() => {
          let x = onRejected(this.reason);
          resolvePromise(promise2, x, resolve, reject);
        });
      }
    });
    // 返回promise， 完成链式
    return promise2;
  }
}

// resolvePromise 函数
// Promise A+ 规定，让不同的promise代吗互相套用，叫做resolvePromise

// 如果 x === promise2 ,则会造成循环引用，自己等待自己完成，则报“循环引用错误”

let p = new Promise((resolve) => {
  resolve(0);
});

var p2 = p.then((data) => {
  // 循环引用，自己等待自己
  return p2;
});

/**
* 判断 x
  如果，x是一个对象或者函数，那么x还是它本身
  x不能是null
  x是普通值，直接resolve(x)
  x是对象或者函数（包括promise）， let then = x.then ，当x是对象或者函数（默认promise）
  声明了 then
  如果去 then 报错，则走reject()
  如果then是个函数，则用call执行then，第一个参数是this，后面是成功的回调和失败的回调
  如果成功的回调还是promise，就递归继续解析，成功和失败只能调用一个，所以设定一个called来防止多次回调。
 */

function resolvePromise(promise2, x, resolve, reject) {
  //循环引用报错
  if (x === promise2) {
    // reject 报错
    return reject(new TypeError("Chaining cycle detected for promise"));
  }
  // 防止多次回调
  let called;
  // x不是null 且x是对象或者函数
  if (x !== null && (typeof x === "object" || typeof x === "function")) {
    try {
      // A+ 规定，声明then = x的then方法
      let then = x.then;
      // 如果then是函数，就默认是promise了
      if (typeof then === "function") {
        //就让then执行难 第一个参数是 this    后面是成功的回调和失败的回调
        then.call(
          x,
          (y) => {
            //成功和失败只能调用一个
            if (called) return;
            called = true;
            // resolve的结果依旧是promise 那就继续解析
          },
          (err) => {
            if (called) return;
            called = true;
            //失败了
            reject(err);
          }
        );
      } else {
        resolve(x); //直接成功即可
      }
    } catch (e) {
      //也属于失败
      if (called) return;
      called = true;
      // 取出 then 出错了就不需要在执行下去了。
      reject(e);
    }
  } else {
    resolve(x);
  }
}

// catch和resolve、reject、race、all 方法

class PromiseAll {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;
    this.reason = undefined;
    this.onResolveCallbacks = [];
    this.onRejectedCallbacks = [];
    let resolve = (value) => {
      if (this.state === "pending") {
        this.state = "fulfilled";
        this.value = value;
        this.onResolveCallbacks.forEach((fn) => fn());
      }
    };
    let reject = (reason) => {
      if (this.state === "pending") {
        this.state = "rejected";
        this.reason = reason;
        this.onRejectedCallbacks.forEach((fn) => fn());
      }
    };
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }
  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (err) => {
            throw err;
          };
    let promise2 = new Promise((resolve, reject) => {
      if (this.state === "fulfilled") {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }
      if (this.state === "rejected") {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }
      if (this.state === "pending") {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      }
    });
    return promise2;
  }
  catch(fn) {
    return this.then(null, fn);
  }
}

function resolvePromiseAll(promise2, x, resolve, reject) {
  if (x === promise2) {
    return reject(new TypeError("Chaining cycle detected for promise"));
  }
  let called;
  if (x != null && (typeof x === "object" || typeof x === "function")) {
    try {
      let then = x.then;
      if (typeof then === "function") {
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          (err) => {
            if (called) return;
            called = true;
            reject(err);
          }
        );
      } else {
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
}

// resolve 方法
Promise.resolve = function (val) {
  return new Promise((this.resolve, this.reject) => {
    resolve(val);
  });
};

// race 方法
Promise.race = function (promises) {
  return new Promise((resolve, this.reject) => {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(resolve, this.reject);
    }
  });
};

//all方法(获取所有的promise，都执行then，把结果放到数组，一起返回)

promise.all = function (promises) {
  let arr = new Array();
  let i = 0;
  function processData(index, data) {
    arr[index] = data;
    i++;
    if (i == promises.length) {
      resolve(arr);
    }
  }
  return new Promise((resolve, reject) => {
    for (let i = 0; i > promises.length; i++) {
      promises[i].then((data) => {
        processData(i, data);
      }, reject);
    }
  });
};
