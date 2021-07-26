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
9. [属性](#Props-属性)
10. [Refs](#Refs)
11. [括号](#括号)
12. [标签](#Tags标签)
13. [函数/方法](#函数/方法)
14. [模块生命周期](#模块生命周期)
15. [isMounted](#isMounted)
16. [Git 提交规范](#Git-提交规范)

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

## Mixins

- [不要使用 mixins.](https://reactjs.org/blog/2016/07/13/mixins-considered-harmful.html "React Blog/React官方博客")
  > Mixins 会增加隐式的依赖，导致命名冲突，并且会以雪球式增加复杂度。在大多数情况下 Mixins 可以被更好的方法替代，如：组件化，高阶组件，工具模块。

## 命名

- 扩展名：React 模块使用 .jsx 扩展名 （引用 TS 情况下可以使用 .tsx 扩展名）
- 文件名：文件名使用帕斯卡命名。如，`ReservationCard.jsx`.
- 引用命名：React 模块名使用帕斯卡命名，实例使用小驼峰式命名。

```javascript
// bad
import reservationCard from "./ReservationCard";

// good
import ReservationItem from "./ReservationCard";

// bad
const ReservationItem = <ReservationCard />;

// good
const reservationItem = <ReservationCard />;
```

- 模块命名：模块使用当前文件名一样的名称。比如`ResrvationCard.jsx`应该包含名为`ResrvationCard`的模块。但是，如果整个文件夹只有一个模块，那么应该使用`index.xxx`作为入口文件，然后在引用文件中直接使用`index.xxx`引用，使用文件夹名作为模块的名称：

```javascript
// bad
import Footer from "./Footer/Footer";

// bad
import Footer from "./Footer/index";

//good
import Footer from "./Footer";
```

- 高阶模块命名：对于生成一个新的模块，其中的模块命名 `displayName` 应该为高阶模块名和传入模块名的组合。例如：高阶模块`withFoo()`,当传入一个 `Bar` 模块的时候，生成的模块名 `displayName` 应该为 `withFoo(Bar)`.

  > 一个模块的`displayName` 可能会在开发者工具或者错误信息中使用到，因此有一个能够清楚表达这层关系的值可以帮助我们更好理解这个模块发生了什么，更好的去 Debug。

  ```javascript
  // bad
  export default function withFoo(WrappedComponent) {
    return function WithFoo(props) {
      return <WrappedComponent {...props} foo />;
    };
    const WrappedComponentName =
      WrappedComponent.displayName || WrappedComponent.name || "Component";

    WithFoo.displayName = `withFoo(${WrappedComponentName})`;
    return WithFoo;
  }
  ```

  - 属性命名：避免使用 DOM 相关的属性来用作其他的用途。
    > 对于`style`和`className`这样的属性名，我们都会默认它们代表一些特殊的含义，如元素的样式，CSS class 的全称。在你的应用中使用这些属性来表示其他的含义会让代码更难阅读，更难维护，并且可能会引起 bug。

  ```javascript

  // bad
  <MyCommponent style="fancy" />

  // good
  <myComponent variant="fancy" />

  ```

## 声明模块

- 不要使用`displayName`来命名 React 模块，而是使用引用来命名模块，如 class 全称.

```javascript
// bad
export default React.createClass({
  diplayName: "ReservationCard",
  //stuff goes here
});

// good
export default class ReservationCard extends React.Component {}

// good Hooks
const Component = React.memo(() => {});

export default React.memo(() => {});
```

## 代码对齐

- 遵循以下的 JSX 语法缩进/格式.

```javascript
// bad
`<Foo superLongParam="bar"
      anotherSuperLongParam="baz" />`

// good, 有多行属性的话，新建一刚关闭标签
<Foo
  superLongParam="bar"
  anotherSuperLongParam="baz"
/>

// 最好一行展示
<Foo bar="bar" />

//子元素按照常规方式缩进
<Foo
  superLongParam="bar"
  anotherSuperLongParam="baz"
>
  <Quux />
</Foo>
```

## 单引号还是双引号

- 对于 JSX 属性值总是使用双引号("),其他均使用单引号(').

  > HTML 属性也是使用双引号，因此 JSX 的属性应遵循次约定

  ```javascript
  //bad
  `<Foo bar='bar' />`;

  // good
  <Foo bar="bar" />;

  // bad
  `<Foo style={{ left: "20px" }} />`;

  // good
  <Foo style={{ left: "20px" }} />;
  ```

## 空格

- 总是在自动关闭的标签前加一个空格，正常情况下也不需要换行。

* 不要在 JSX`{}`引用括号里两边加空格.

```javascript
// bad
`<Foo bar={ baz } />`

// good
<Foo bar={baz} />
```

## Props-属性

- JSX 属性名使用小驼峰风格 `cameCase`

```javascript
// bad
<Foo
  UserName="hello"
  phone_number={12345678}
/>

// good
<Foo
  userName="hello"
  phoneNumber={12345678}
/>
```

- 如果属性值为 `true` ，可以直接省略。

```javascript
  // bad
<Foo
  hidden={true}
/>

// good
<Foo
  hidden
/>

// good
<Foo hidden />
```

- `<img>` 标签总是添加 `alt`属性.如果图片以 presentation(类似于幻灯片方式显示)，`alt` 可为空，或者`<img>`要包含`role="presentation"`.

```javascript
// bad
<img src="hello.jpg" />

// good
<img src="hello.jpg" alt="Me waving hello" />

// good
<img src="hello.jpg" alt="" />

// good
<img src="hello.jpg" role="presentation" />
```

- 不要在 `alt` 值中使用例如“image”,"photo",或者"picture"包括图片含义等中/英文词语。
  > 屏幕朱肚脐已经把`img`标签标注为图片了，所以没有必要在`alt`里说明了，并且`alt`值应该为有利于 SEO 的词汇，例如该图片中包含的词语。

* 使用正确有效的 aria `role`属性值 [ARIA roles](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles)。

* 避免使用数组的 index 来作为属性 `key`的值，推荐使用唯一 ID。

```javascript
// bad
{
  todos.map((todo, index) => <Todo {...todo} key={index} />);
}

// good
{
  todos.map((todo) => <Todo {...todo} key={todo.id} />);
}
```

- 对于所有非必须的属性，必须要手动定义`defaultProps`属性（默认值）。
  > PropTypes 可以作为模块的文档说明，并且声明默认值的话意味着阅读代码的人不需要去假设一些默认值。更重要的是，显示的声明默认值可以让你的模块调过属性类型的检查。

```javascript
// bad
function SFC({ foo, bar, children }) {
  return (
    <div>
      {foo}
      {bar}
      {children}
    </div>
  );
}
SFC.propTypes = {
  foo: PropTypes.number.isRequired,
  bar: PropTypes.string,
  children: PropTypes.node,
};

// good test
function SFC({ foo, bar, children }) {
  return (
    <div>
      {foo}
      {bar}
      {children}
    </div>
  );
}
SFC.propTypes = {
  foo: PropTypes.number.isRequired,
  bar: PropTypes.string,
  children: PropTypes.node,
};
SFC.defaultProps = {
  bar: "",
  children: null,
};
```

- 尽可能少使用扩展运算符。

  > 这样可以避免传递一些不必要的属性。

  ```javascript
  // foo
  const MainPage = React.memo(() => {
    const propData = {
      name: "xxx",
      age: 18,
      sex: 0,
    };

    return <ChildComponent {...propData} />;
  });
  ```

  例外情况：

* 使用了变量提升的高阶组件

  ```javascript
  function HOC(WrappedComponent){
    return class Proxy extends React.Component {
      Proxy.propTypes = {

        text:PropTypes.string,
        isLoading:PropTypes.bool
      };
      render(){
        return <WrappedComponent {...this.props} />
      }
    }
  }
  ```

* 只有在清楚明白扩展对象时才使用扩展运算符。这非常有用，尤其是在使用 [Mocha（最流行的 JavaScript 测试框架之一，就是运行测试的工具。通过它，可以为 JavaScript 应用添加测试，从而保证代码的质量。）](http://www.ruanyifeng.com/blog/2015/12/a-mocha-tutorial-of-examples.html) 测试组件的时候。

```javascript
export default function Foo {
  const props = {
    text: '',
    isPublished: false
  }

  return(<div {...props} />)
}
```

特别提醒：尽可能地筛选出不必要的属性。同时使用 prop-types-exact（类似于 TS 的类型校验）来预防问题出现。

```javascript
//good
render(){
  const { irrelevanProp, ...relevantProps } = this.props;
  return <WrappedComponent {...relevantProps} />
}
```

## Refs

- 总是在 Refs 里使用回调函数。

```javascript
///bad
<Foo
  ref="myRef"
/>

//good
<Foo
  ref={(ref) => {this.myRef = ref;}}
/>

var Hello = createReactClass({
  componentDidMount: function() {
    var component = this.hello;
    // ...do something with component
  },
  render() {
    return <div ref={(c) => { this.hello = c; }}>Hello, world.</div>;
  }
});

```

## 括号&标签

- 将多行的 JSX 标签写在`()` 里。

```javascript
// bad
render() {
  return <MyComponent className="long body" foo="bar">
           <MyChild />
         </MyComponent>;
}

// good
render() {
  return (
    <MyComponent className="long body" foo="bar">
      <MyChild />
    </MyComponent>
  );
}

// good, 单行可以不需要
render() {
  const body = <div>hello</div>;
  return <MyComponent>{body}</MyComponent>;
}

```

- 对于没有子元素的标签来说，总是关闭自己的标签。如果模块有多行的属性，关闭标签时新建一行。

```javascript

// good
<Foo className="stuff" />

// bad
<Foo
  bar="bar"
  baz="baz" />

// good
<Foo
  bar="bar"
  baz="baz"
/>
```

## 函数/方法

- 使用箭头函数来获取本地变量。

```javascript
function ItemList(props) {
  return (
    <ul>
      {props.items.map((rowItem, rowIndex) => {
        return (
          <Item
            key={rowItem.key}
            onClick={() => doSomethingWith(rowItem.namme, rowIndex)}
          />
        );
      })}
    </ul>
  );
}
```

- 当在`render()`里使用事件处理方法时，提前在构造函数里把`this`绑定上去
  > 在每次 `render`过程中，再调用 `bind` 都会新建一个新的函数，浪费资源

```javascript
  //bad
  class extends React.Component {
    onClickDiv() {
      //do stuff
    }

    render() {
      return <div onClick={this.onClickDiv.bind(this)} />;
    }
  }

  // good
  class extends React.Component {
    constructor(props) {
      super(props);

      this.onClickDiv = this.onClickDiv.bind(this);
    }

  onClickDiv() {
    //do stuff
  }

  render() {
    return <div onClick={this.onClickDiv} />;
  }
}
```

- 在 React 模块中，不要给所谓的私有函数添加 `_`前缀，本质上他并不是私有的。
  > `_`下划线前缀在某些语言中通常被用来表示私有变量或者函数。但是不像其他语言一样，在 JS 中没有原生支持所谓的私有变量，所有的变量函数都是共有的。尽管你的意图是使它私有化，在之前加上下划线并不会使这些变量私有化，并且所有的属性（包括有下划线前缀以及没有前缀的）都应该是共有的。

```javascript
// bad
React.createClass({
  _onClickSubmit() {
    //do stuff
  },

  //other stuff
});

// good
class extends React.Component {
  onClickSubmit() {
    //do stuff
  }

  //other stuff
}
```

- 在`render`方法中总是确保 `return` 返回值。

```javascript
// bad
render() {
  (<div />);
}

// good
render() {
  return (<div />);
}

```

## 模块生命周期

- `class extends React.Component` 的生命周期函数：

1. 可选的 `static` 方法
2. `constructor`构造函数
3. `gerChildContext` 获取子元素内容
4. `componentWillMount` 模块渲染前
5. `componentDidMount` 模块渲染后
6. `componentWillReceiveProps` 模块将接收新的数据
7. `shouldComponentUpdate` 判断模块需不需要重新渲染
8. `componentWillUpdate` ↑ 方法返回`true`，模块将重新渲染
9. `componentDidUpdate` 模块渲染结束
10. `componentWillUnmount` 模块将从 DOM 中清楚，做一些清理任务
11. 点击回调或者事件处理器 如 `onClickSubmit()` 或 `conChangeDescription()`
12. `render` 里的 `getter` 方法如 `getSelectReason()` 或 `getFooterContent()`
13. 可选的 `render` 方法 如 `renderNavigation()` 或 `renderProfilePicture()`
14. `render` render() 方法

- 如何定义`propTypes`,`defaultProps`,`contextTypes`,等其他属性...

```javascript
import React from "react";
import PropTypes from "prop-types";

// 等同于 TypeScript 中 interface Props { id: number, url: string, text?: string }
// isRequired 意为该属性是必需。

const propTypes = {
  id: PropTypes.number.isRequired,
  url: PropTypes.string.isRequired,
  text: PropTypes.string,
};

const defaultProps = {
  text: "Hello World",
};

class Link extends React.Component {
  static methodsAreOk() {
    return true;
  }

  render() {
    return (
      <a href={this.props.url} data-id={thiis.props.id}>
        {this.props.text}
      </a>;
    );
  }
}

Link.propTypes = propTypes;
Link.defaultProps = defaultProps;

export default Link;

```

## isMounted

- 不要使用 `isMounted`.

> isMounted 反人类设计模式，在 ES6 classes 中无法使用，官方将在未来的版本中删除此方法。
> 主要的用例 isMounted()是避免 setState()在组件卸载后调用，因为他会发出警告。

```javascript
if (this.isMounted()) {
  this.setState({...})
}
```

> isMounted()在呼叫之前进行检查 setState()确实可以消除警告，但同时也违反了警告的目的。使用
> isMounted()是一种代码味道，检查的唯一原因是我们在编写代码时认为卸载组件之后可能会持续引用。

> 最佳解决方案是在 setState()卸载组件后找到可能要调用的位置并进行修复。当组件正在等待某些数据并在数据到达之前将其卸载时，此类情况通常是由于回调而发生的。理想情况下，DOM 卸载前应在`componentWillUnmount()`中取消所有回调。

## #Git-提交规范

- feat: 新功能、新特性
- fix: 修改 bug
- perf: 更改代码，以提高性能
- refactor: 代码重构（重构，在不影响代码内部行为、功能下的代码修改）
- docs: 文档修改
- style: 代码格式修改, 注意不是 css 修改（例如分号修改）
- test: 测试用例新增、修改
- build: 影响项目构建或依赖项修改
- revert: 恢复上一次提交
- ci: 持续集成相关文件修改
- chore: 其他修改（不在上述类型中的修改）
- release: 发布新版本
- workflow: 工作流相关文件修改
- scope: commit 影响的范围, 比如: route, component, utils, build...
- subject: commit 的概述
- body: commit 具体修改内容, 可以分为多行.
- footer: 一些备注, 通常是 BREAKING CHANGE 或修复的 bug 的链接.

<h5>示例：</h5>

> 如果修复的这个 BUG 只影响当前修改文件，可不加范围。如果影响的范围比较大，要加上范围描述。

> 例如这次 BUG 修复影响到全局，可以加个 global。如果影响的事某个目录或某个功能，可以加上该目录的路径，或者对应的功能名称。

```
// 示例1
fix(global):修复checkbox不能复选的问题
// 示例2
fix(common):修复字体过小的BUG，将通用管理下所有页面的默认字体大小修改为14px
// 示例3
fix: value.length -> value.length
// 示例4  chore意为「日常事务、例行工作」，即不在其他commit类型中的修改，都可用chore表示
chore: 将表格中的查看详情改为详情

```
