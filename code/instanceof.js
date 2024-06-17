function _instanceof(instance, classOrFunc) {
  if (typeof instance !== "object" || instance == null) return false;

  let proto = Object.getPrototypeOf(instance); // 等价于 instance.__proto__
  console.log(proto);
  while (proto) {
    if (proto == classOrFunc.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

let a = [1, 2, 3];

console.log(a.__proto__);

console.log(_instanceof(a, Array));
