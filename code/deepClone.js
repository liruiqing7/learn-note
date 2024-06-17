let obj = {
  name: "lee",
  age: 12,
  fe: ["gogoup", "hellofer"],
  fun: {
    class: null,
    course: [1, 2, undefined, "34"],
  },
  newFun: function () {
    console.log(this.age, "age");
  },
};

function deepClone(target) {
  let res = null;
  if (typeof target === "object") {
    if (Array.isArray(target)) {
      res = [];
      for (let i in target) {
        res.push(deepClone(target[i]));
      }
    } else if (target == null) {
      res = null;
    } else if (target.constructor == RegExp) {
      res = target;
    } else {
      res = {};
      for (let i in target) {
        res[i] = deepClone(target[i]);
      }
    }
  } else {
    res = target;
  }
  return res;
}

let obj2 = deepClone(obj);

obj2.newFun();

console.log(obj2);

let obj3 = JSON.parse(JSON.stringify(obj));

console.log(obj3);

function deepClone2(target) {
  if (typeof target !== "object" || target == null) {
    return target;
  }
  let copy = {};
  if (copy instanceof Array) {
    copy = [];
  }
  for (let key in target) {
    if (target.hasOwnProperty(key)) {
      copy[key] = deepClone2(target[key]);
      console.log(key + ":" + target[key]);
    }
  }
  return copy;
}

let obj4 = deepClone2(obj);

console.log(obj4);
