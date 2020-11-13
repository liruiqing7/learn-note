React & JSX 编码规范及 Git 提交规范

# 内容目录

1. [基本规范](#BasicRules基本规范)
2. [Class vs React.createClass vs stateless](#创建模块)
3. [MMixins](#MMixins)
4. [命名](#命名)
5. [声明模块](#声明模块)
6. [代码对齐](#代码对齐)
7. [单引号还是双引号](#单引号还是双引号)
8. [空格](#空格)
9. [属性](#属性)
10. [Refs 引用](#Refs引用)
11. [括号](#括号)
12. [标签](#标签)
13. [函数/方法](#函数/方法)
14. [模块生命周期](#模块生命周期)
15. [isMounted](#isMounted)

## BasicRules 基本规范

- 每个文件只写一个模块
  - 但是多个无状态模块可以放在单个文件中
- 推荐使用 JSX 语法，不要使用 React.createElement, 除非从一个非 JSX 的文件中初始化 app。

## 创建模块

- 如果模块有内部状态或者是 refs，推荐使用 calss extends React.Component 而不是 React.createClass。

```javascript
// bad
const Listing = React.createClass({
  //...
  render() {
    return <div>{this.state.hello}</div>;
  },
});

// good
class Listing extends React.Component {
  //...
  render() {
    return <div>{this.state.hello}</div>;
  }
}
```

如果模块没有状态或者没有引用`refs`，推荐使用普通函数（非箭头函数）而不是类:

```javascript
// bad
class Listing extend React.Component {
  render(){
    return <div>{this.props.hello}</div>;
  }
}
// bad （不鼓励依赖函数名来推断）
const Listing = ({ hello }) => (
  <div>{hello}</div>
)

// good
function Listing({ hello }) {
  return <div>{hello}</div>;
}

```

## MMixins

## 命名

## 声明模块

## 代码对齐

## 单引号还是双引号

## 空格

## 属性

## Refs 引用

## 括号

## 标签

## 函数/方法

## 模块生命周期

## isMounted
