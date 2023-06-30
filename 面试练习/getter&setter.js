let obj = {
  name: "lee",
  age: 24,
  get fullName() {
    return this._name;
  },
  set fullName(value) {
    if (value.length > 5) {
      this._name = value;
      return;
    } else {
      console.log("数值太小");
      return;
    }
    console.log("默认输出");
  },
};

// obj.fullName = "wang";

Object.defineProperty(obj, "newModal", {
  value: "true",
  writable: true,
  // 是否可修改属性的value
  enumerable: false,
  // 对象的可枚举性除了会影响for…in还会影响Object.keys()和JSON.stringify方法
});

console.log(Object.keys(obj));

var obj = {};
Object.defineProperty(obj, "key", {
  enumerable: false,
  configurable: false,
  writable: false,
  value: "static",
});
