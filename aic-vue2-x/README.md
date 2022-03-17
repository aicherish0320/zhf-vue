# Vue2.6 源码解析

## 使用 Rollup 搭建开发环境

### 1. 什么是 rollup

Rollup 是一个 JavaScript 模块打包器，可以将小块代码编译成大块复杂的代码，rollup.js 更专注于 JavaScript 类库打包（开发应用时使用 webpack，开发库时使用 Rollup）

### 2. 环境搭建

- rollup
- rollup-babel
- @babel/core
- @babel/preset-env

## Vue 的初始化流程

Vue 默认支持响应式数据变化，区别于双向绑定

1. 双向绑定页面得需要能修改（表单 radio checkbox input textarea），数据变化可以影响视图显示
2. 响应式数据变化，能监控到数据变化，并且更新视图（单向的）

Vue 并不一个严格遵循 MVVM 模式的，vue 默认只是做视图的
Vue 是一个渐进式框架 （组件化 + VueRouter+ Vuex + VueCli）
