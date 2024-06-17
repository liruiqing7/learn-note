Function.prototype.customApply = function (context, args) {
  if (typeof this !== "function") {
    throw new TypeError("type error");
  }
  context = context || window;
  let _args = Array.isArray(args) ? args : [];
  context.__fn__ = this;
  let res = context.__fn__(..._args);

  delete context.__fn__;

  return res;
};

function f(a, b) {
  console.log(a, b);
  console.log(this.name);
}

let obj = {
  name: "lee",
};

f.customApply(obj, [1, 2]);
