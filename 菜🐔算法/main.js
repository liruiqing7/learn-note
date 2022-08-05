const newFunc = (arr) => {
  let _arr = [];
  for (let i in arr) {
    if (Array.isArray(arr[i])) {
      _arr = _arr.concat(newFunc(arr[i]));
    } else {
      _arr.push(arr[i]);
    }
  }
  return _arr;
};

// console.log(newFunc([1, 2, 3, [1, 2, 3, [4, 3]]]));

const str = { a: "1" };

function Func() {}

Func.prototype.obj = str;
Func.prototype.arr = [1, 2, 3];

const obj = new Func();

// console.log(Func instanceof Array);

const deepClone = (target) => {
  let result;
  if (typeof target === "object") {
    if (Array.isArray(target)) {
      result = [];
      for (let i in target) {
        console.log(target[i], i, "+++");
        result.push(deepClone(target[i]));
      }
    } else {
      result = {};
      for (let i in target) {
        console.log(target[i], i, "---");
        result[i] = deepClone(target[i]);
      }
    }
  } else {
    result = target;
  }
  return result;
};

// let obj2 = deepClone(obj);

// console.log(obj2);
