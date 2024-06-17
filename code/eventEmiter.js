// class EventEmiter {
//   constructor() {
//     this._events = {};
//   }
//   // 订阅时间的方法
//   on(eventName, callBack) {
//     if (!this._events) {
//       this._events = {};
//     }
//     // 合并之前订阅的cb
//     this._events[eventName] = [...(this._events[eventName] || []), callBack];
//   }
//   // 触发事件的方法
//   emit(eventName, ...args) {
//     if (!this._events[eventName]) return;
//     // 遍历执行所有订阅事件

//     this._events[eventName].forEach((fn) => fn(...args));
//   }
//   // 删除订阅事件
//   off(eventName, cb) {
//     if (!this._events[eventName]) return;

//     this._events[eventName] = this._events[eventName].filter(
//       (fn) => fn != cb && fn.l != cb,
//     );
//   }
//   // 绑定一次 触发后将绑定的移除掉 再次触发掉
//   once(eventName, callBack) {
//     const one = (...args) => {
//       // 等callback执行完毕再删除
//       callBack(args);
//       this.off(eventName, one);
//     };
//     one.l = callBack;
//     this.on(eventName, one);
//   }
// }

// let event = new EventEmiter();

// let login1 = function (...args) {
//   console.log("login success1", args);
// };

// let login2 = function (...args) {
//   console.log("login success2", args);
// };

// event.once("login", login2);
// event.off("login", login1);
// event.emit("login", 1, 2, 3, 4, 5);
// event.emit("login", 6, 7, 8, 9);
// event.emit("login", 10, 11, 12);

class EventEmiter {
  constructor() {
    // 事件对象，存放订阅的名字和事件
    this._events = {};
  }
  // 订阅事件的方法
  on(eventName, callback) {
    if (!this._events) {
      this._events = {};
    }
    // 合并之前订阅的cb
    this._events[eventName] = [...(this._events[eventName] || []), callback];
  }
  // 触发事件的方法
  emit(eventName, ...args) {
    if (!this._events[eventName]) {
      return;
    }
    // 遍历执行所有订阅的事件
    this._events[eventName].forEach((fn) => fn(...args));
  }
  off(eventName, cb) {
    if (!this._events[eventName]) {
      return;
    }
    // 删除订阅的事件
    this._events[eventName] = this._events[eventName].filter(
      (fn) => fn != cb && fn.l != cb,
    );
  }
  // 绑定一次 触发后将绑定的移除掉 再次触发掉
  once(eventName, callback) {
    const one = (...args) => {
      // 等callback执行完毕在删除
      callback(args);
      this.off(eventName, one);
    };
    one.l = callback; // 自定义属性
    this.on(eventName, one);
  }
}

let event = new EventEmiter();

let login1 = function (...args) {
  console.log("login success1", args);
};
let login2 = function (...args) {
  console.log("login success2", args);
};
// event.on('login',login1)
event.once("login", login2);
event.off("login", login1); // 解除订阅
event.emit("login", 1, 2, 3, 4, 5);
// event.emit("login", 6, 7, 8, 9);
// event.emit("login", 10, 11, 12);

setTimeout(() => {
  event.emit("login", 6, 7, 8, 9);
}, 3000);
