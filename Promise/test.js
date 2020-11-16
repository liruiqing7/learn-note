var p1 = new Promise(function (resolve) {
  setTimeout(function () {
    resolve(1);
  }, 1000);
});

p1.then(function (val) {
  var p3 = new Promise(function (resolve) {
    setTimeout(function () {
      resolve(val + 1);
    }, 1000);
  });

  return p3;
}).then(function (val) {
  console.log(val);
});
this.then = function (onFulfilled, onRejected) {
  return new Promise(function (resolve, reject) {
    handle({
      onFulfilled: onFulfilled,
      onRejected: onRejected,
      resolve: resolve,
      reject: reject,
    });
  });
};
