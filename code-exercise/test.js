Function.prototype.myCall = function (context = gloablTHis) {
  context.fn = this;
  console.log(this, "this");
  const otherArgs = Array.from(this.arguments).slice(1);
  context.fn(otherArgs);
  let res = context.fn();
  delete context.fn;
  return res;
};
