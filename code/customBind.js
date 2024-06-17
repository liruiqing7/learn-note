/**
 * bind 返回一个新函数，新函数会把调用时的this值绑定到bind方法的第一个参数所指向的对象。
 * 除了绑定this外，bind 还可以在新函数被调用时，传入一些预设的参数。
 */

Function.prototype.myBind = function (context) {
  var _this = this;
  var args = [...arguments].slice(1);

  return function F() {
    if (this instanceof F) {
      return new _this(...args, ...arguments);
    }
    return _this.apply(context, args.concat(...arguments));
  };
};

Function.prototype.customBind = function (context, ...args) {
  let _this = this;

  return function (...curArg) {
    return _this.apply(context, [...args, ...curArg]);
  };
};

const obj = { name: "john", age: 1 };

function ageFunc(age) {
  console.log(age + this.age);
}

let bindFUnc = ageFunc.myBind(obj, 1);

bindFUnc();

function greet(message) {
  console.log(`${message},${this.name}`);
}

const boundGreet = greet.customBind(obj, "hello");

boundGreet();
