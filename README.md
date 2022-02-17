# 珠峰架构-VueJS

手写 VueJS：数据响应式原理、依赖收集、虚拟 DOM、diff 算法

## rollup 的配置

使用 `Rollup` 搭建开发环境 1.什么是**Rollup**?
`Rollup`是一个`JavaScript`模块打包器，可以将小块代码编译成大块复杂的代码，`rollup.js`更专注于`Javascript`类库打包（开发应用时使用`webpack`，开发库时使用`Rollup`）

- `@babel/core`： babel 核心模块
- `@babel/preset-env`：将高级语法转化成低级语法
- `rollup-plugin-babel`：rollup 中使用 babel 插件

## Vue 的初始化流程

`Vue` 默认支持响应式数据变化 （双向绑定）

1. 双向绑定页面得需要能修改（表单 `radio` `checkbox` `input` `textarea）数据变化可以影响视图显示`
2. 响应式数据变化 能监控到数据变化 并且更新视图 （单向的）

`Vue` 模式 并不是 `MVVM`，Vue 默认只是做视图的，渐进式 + 组件化 + vue-router + vuex +vue-cli

我们要知道数据是如何变化的，`Object.defineProperty`将对象中原有的属性 更改成带有 get 和 set 的一个属性，这样当修改的时候 会触发 set 方法 -> 更新视图

## new Vue 发生什么

1. `new Vue` 会调用 `_init` 方法进行初始化操作
2. 会将用户的选项放到 `vm.$options` 上
3. 会对当前属性上搜索有没有 `data` 数据 `initState`
4. 有 `data`，判断 `data` 是不是一个函数，如果是函数则取返回值 `initData`
5. 如果有 `el` 需要挂载到页面上
