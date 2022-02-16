# 珠峰架构-VueJS

手写 VueJS：数据响应式原理、依赖收集、虚拟 DOM、diff 算法

## rollup 的配置

使用 `Rollup` 搭建开发环境 1.什么是**Rollup**?
`Rollup`是一个`JavaScript`模块打包器，可以将小块代码编译成大块复杂的代码，`rollup.js`更专注于`Javascript`类库打包（开发应用时使用`webpack`，开发库时使用`Rollup`）

- `@babel/core`： babel 核心模块
- `@babel/preset-env`：将高级语法转化成低级语法
- `rollup-plugin-babel`：rollup 中使用 babel 插件
