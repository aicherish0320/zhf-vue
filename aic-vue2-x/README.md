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

## 步骤

1. `new Vue` 会调用 `_init` 方法进行初始化操作
2. 会将用户的选项放到 `vm.$options` 上
3. 会对当前属性上有没有 `data` 数据 **initState**
4. 有 `data` 判断 `data` 是不是一个函数，如果是函数取返回值 **initData**
5. `observe` 去观测 `data` 中的数据，和 vm 没关系，说明 data 已经变成响应式了
6. `vm` 上想取值也能取到 `data` 中的数据 `vm._data = data`，这样用户能取到 `data`
7. `vm.xx => vm._data.xx`

如果有 el 需要挂载到页面上

## 数据响应式处理

数组也可以使用 defineProperty，但是开发者很少采用 arr[x] = y 的方式去修改数组
如果数组也使用了 defineProperty 还是可以实现修改索引触发更新的，但是这种操作概率低，所以源码中没有采用这种方式
vue3 中为了兼容 proxy，内部对数组用的就是 defineProperty

## 原型

1. 每个对象都有一个 `__proto__`属性，指向它所属类的原型 `fn.__ptoto__ = Function.prototype`
2. 每个原型上都有一个`constructor`属性，指向函数本身 `Function.prototype.constructor = Function`
