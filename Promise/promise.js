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
          let x = onRej;
        });
        this.onRejected(this.reason);
      }
    });
  }
}
