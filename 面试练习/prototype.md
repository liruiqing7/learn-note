#

```js
// 什么是原型：
// 每个函数都会创建一个 prototype 属性，这个属性是一个对象，里面包含了用于共享的属性和方法。
// 这个对象就是通过调用构造函数而创建的对象的原型。原来在构造函数中直接赋给对象实例的值，可以直接赋值给原型。
function Person() {}
Person.prototype.name = "lee";
Person.prototype.age = 23;
Person.prototype.getName = function () {
  return this.name;
};

const newFunc = new Person();

console.log("newFunc", newFunc);
// Person.prototype 和 newFunc 的 [[Prototype]]都指向同一个对象，这个对象对于Person构造函数来说叫做原型对象，对于 newFunc来说叫原型。
// 构造函数、原型和实例的关系：每个构造函数都有一个原型对象（实例的原型），原型有一个 constructor 属性指回构造函数，而实例有一个内部指针指向原型。在浏览器环境中这个指针叫__proto__，其他环境下没有访问[[Prototype]]的标准方式。
```
