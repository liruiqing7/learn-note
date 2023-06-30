# Next.js 的渲染模式

> Next 封装了 React 服务端渲染功能，并形成了一整套技术体系，可以开箱即用，性能很好，不需要自己单独去开发和维护一套 React 服务端渲染的体系。

服务端渲染的定义

> SSR 客户端发起请求拿资源，服务器接收到请求，并编译好 html 字符串，当浏览器收到 http 响应时，拿着 html 字符串直接渲染页面。此时页面没有交互功能。客户端接管后，注入 js 并解析，执行完毕后，页面构建完成。这个服务端组装 html 的过程，叫做服务端渲染。

## Next.js 中的渲染模式

- getStaticProps
- getInitialProps
- getServerSideProps
- 客户端获取

## Next.js 的首屏渲染模式

- 页面静态化（SSG）：nextjs 应用页面会默认静态化，除非使用`getServerSideProps`和`getInitialProps`。
- `静态增量再生（ISG）`：使用`getStaticProps`来获取数据才能实现,且配合其返回的参数`revalidate`来控制，也可以配合`getStaticPaths`或者`接口通知的方式`来实现动态路由的静态增量。
- `服务端动态渲染（SSR）`：使用`getServerSideProps`和`getInitialProps`进行渲染的模式。

## 静态化渲染（SSG）和静态增量再生（ISG）

什么是页面`静态化`？

> 打包阶段就已经生成了页面的 html 结构。如果有`getStaticProps`，则会在打包过程中执行，并把执行结果传递给页面 props 进行渲染页面，然后在接受到页面请求时，直接返回此 html，用户即可看到页面内容。
> 项目打包结束后，如果有 `next export` 命令，当页面使用的是`getIntialProps`方式进行渲染，next 也会对其做静态化处理，如果使用了`getServerSideProps`，则会抛出异常，并停止生成静态页面。

为何要`静态化`？

> 性能更好！服务器只需要把构建好的 html 发送到浏览器，而不需要在收到请求后再去动态生成 html。

适合`静态化`的页面：

> 例如：协议页面，活动推广页等页面更改频率低，状态化少。

如果页面需要一定的动态更新能力，那么可以考虑使用`静态增量再生`功能,他有以下几种方式：

- 设置更新时间（revalidate），`revalidate`是 getStaticProps 的一个选择性参数，他可以用来决定一个页面多久会重新打包一次。

```javascript
  export async getStaticProps(context) => {
    const res = await fetch(`https://.../data`)
    const data = await res.json()
    return{
      props: {},
      revalidate: 60
    }
  }
  // revalidate: 60 ，Next 会修改 header 中的 Cache-Control 数值。
```

- 指令方式，通过 api 接口动态下发指令更新。

- 动态路由，可以根据首次访问的时候去动态生成页面，可配合前两种方式进行。（就是更改路由参数使页面更新）

## 服务端渲染

`getServerSideProps`和`getInitialProps`都能实现在服务端合成页面内容，首屏渲染没什么差别，两者的区别主要在于：

- 输出到客户端的代码有所差别
  > `getServerSidePorps`的代码并不会暴露在客户端,该命令使用时，会在 node 端去执行，而`getInitialProps`是在客户端执行。不过两者都是调用完成后才会跳转到对应的页面。
- 是否支持静态化
  > `getServerSideProps`不支持静态化，`getInitialProps`在使用 export 模式下支持静态化，但有 bug。

## Next.js 渲染模式之间的对比

- `getStaticProps`：首屏渲染直接返回构建好的 html，不需要服务端做其他操作；页面跳转时只需要加载 client 目录对应页面的 js 资源；node 端只需要转发资源，服务器压力很低。

- `getServerSideProps`：首屏渲染时需要执行该函数，并且需要调用`renderToString`来生成 html；跳转页面时，需要提前与服务端发起请求，等待服务端执行该函数返回结果后，再在客户端生成 html 内容，最后再进行切换页面内容。安全性上，使用该命令可以不暴露函数的执行过程，但每次进入页面时，node 端都需要执行处理一些事项，压力会比较高。

- `getInitialProps`：首屏渲染时需要执行，需要调用`renderToString`方法来生成 html；跳转页面时，也需要提前调用该函数，等待执行后返回的结果，最后在客户端生成 html 内容。执行过程与`getServerSideProps`大致相同。

| 指标          | getStaticProps | getServerSideProos | getInitialProps |
| ------------- | -------------- | ------------------ | --------------- |
| 首页性能      | S              | A                  | A               |
| 跳转性能      | S              | B                  | B               |
| 安全性        | B              | A                  | C               |
| node 端压力   | 低             | 高                 | 中高            |
| next 官方推荐 | 超级推荐       | 推荐               | 不推荐          |
