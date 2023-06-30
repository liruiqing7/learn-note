function create() {
  // 创建一个空对象
  let person = new Object();
  // 获取第一个参数即构造函数，同时 arguments 中删除第一个参数
  let con = [].shift.call(arguments);
  // 链接到原型，obj 可以访问到构造函数原型中的属性
  person.__proto__ = con.prototype;
  // 绑定this 实现继承，obj可以访问到构造函数中的属性
  let res = con.apply(person, arguments);
  // 判断下返回的是不是对象，优先返回构造函数返回的对象
  return res instanceof Object ? res : person;
}

function Car(color) {
  this.color = color;
}

Car.prototype.start = function () {
  console.log(this.color + "car start");
};

var car = create(Car, "black");

console.log(car.color);
