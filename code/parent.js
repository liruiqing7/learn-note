function Parent(name) {
  this.name = name;
}

Parent.prototype.say = function () {
  console.log(this.name + " say");
};

Parent.prototype.play = function () {
  console.log(this.name + " play");
};

function Child(name, parent) {
  Parent.call(this, parent);
  this.name = name;
}

Child.prototype = Object.create(Parent.prototype);
Child.prototype.say = function () {
  console.log(this.name + " say");
};

Child.prototype.constructor = Child;

let parent = new Parent("parent");
parent.say();

let child = new Child("child");
child.say();
child.play();

function Parent2() {
  this.name = "parent2";
  this.play = [1, 2, 3];
}

function Child2() {
  this.name = "child2";
  Parent2.call(this);
}

// Child2.prototype = Object.create(Parent2.prototype);
// Child2.prototype.constructor = Child2;

let s1 = new Child2();
let s2 = new Child2();

s1.play.push(4);
console.log(s2.play, s1.play);

function Plugin(options) {
  this.options = options || {};
}

function ExtendedPlugin(options) {
  Plugin.call(this, options); // 继承 Plugin 的属性和方法

  this.newMethod = function () {
    // 新的方法逻辑
    if (this.options.enabled) {
      console.log("Plugin is enabled.");
      // 执行具体的业务操作
      this.performAction();
    } else {
      console.log("Plugin is disabled.");
    }
  };

  this.performAction = function () {
    // 模拟执行某种操作
    console.log("Performing action with options:", this.options);
  };
}

// 使用示例
var plugin1 = new ExtendedPlugin({ key: "value", enabled: true });
plugin1.newMethod(); // 调用新的方法，执行业务逻辑
