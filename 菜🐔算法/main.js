let obj = {
  age: 18,
  name: "lee",
  adress: {
    city: "北京",
    country: { a: "中国", b: "中国香港" },
  },
  about: {
    like: "sing",
  },
};

const jsonFlatten = (data) => {
  var result = {};
  function recurse(cur, prop) {
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      for (var i = 0, l = cur.length; i < l; i++) {
        recurse(cur[i], prop + "[" + i + "]");
      }
      if (l === 0) {
        result[prop] = [];
      }
    } else {
      var isEmpty = true;
      for (var p in cur) {
        isEmpty = false;
        recurse(cur[p], prop ? prop + "." + p : p);
      }
      if (isEmpty && prop) {
        result[prop] = {};
      }
    }
  }
  recurse(data, "");
  return result;
};

console.log(jsonFlatten(obj));
