function myNew(constructor, ...args) {
  // 利用原型链创建一个空对象，并且绑定constructor原型对象上的属性
  let newObj = Object.create(constructor.prototype);
  // 改变this指向并绑定新对象的属性
  let res = constructor.apply(newObj, args);

  // 如果函数的执行结果有返回值并且是对象，返回执行结果，否则返回新创建的对象地址
  return typeof res === "object" ? res : newObj;
}

function Person(name, age) {
  this.name = name;
  this.age = age;
}

function myNew(constructor, ...args) {
  let obj = Object.create(constructor.prototype);
  let res = constructor.apply(obj, args);

  return typeof res === "object" ? res : obj;
}

// console.log(Object.prototype.toString.call(1));

const arrowFunc = (...args) => {
  console.log(this, "this");
  console.log(args, "args");
  console.log(arguments, "arguments");
};

function create(fn, ...args) {
  if (typeof fn !== "function")
    throw new Error("first argument is not a function");

  let obj = Object.create(fn.prototype);

  let res = fn.apply(obj, args);

  return typeof res === "object" ? res : obj;
}
