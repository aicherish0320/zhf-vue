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
8. 如果更新对象不存在的属性，会导致视图不更新，如果是数组更新索引和长度也不会触发页面更新
9. 如果是替换成一个新对象，新对象会被进行劫持，如果是数组存放新内容，新增的内容也会被劫持
10. 如果你想修改索引，可以使用 $set 方法，内部是就是 splice

如果有 el 需要挂载到页面上

## 数据响应式处理

数组也可以使用 defineProperty，但是开发者很少采用 arr[x] = y 的方式去修改数组
如果数组也使用了 defineProperty 还是可以实现修改索引触发更新的，但是这种操作概率低，所以源码中没有采用这种方式
vue3 中为了兼容 proxy，内部对数组用的就是 defineProperty

## 原型

1. 每个对象都有一个 `__proto__`属性，指向它所属类的原型 `fn.__ptoto__ = Function.prototype`
2. 每个原型上都有一个`constructor`属性，指向函数本身 `Function.prototype.constructor = Function`

## Vue 的渲染流程（只会走一次，后续更新的时候，直接调用 render 函数，生成虚拟 DOM，进行 dom diff）

> 1. 默认调用 `vue._init` 方法将用户的参数挂载到 $options 选项中 vm.$options
> 2. vue 会根据用户的参数进行数据的初始化 props computed watch，会获取到对象作为数据， 可以通过 `vm._data` 访问到用户的数据
> 3. 对数据进行观测，对象（递归使用 defineProperty）和数组（数组的方法重写），劫持用户的操作，比如：用户修改了数据 -> 更新视图
> 4. 将数据代理到 vm 对象上 vm.xx -> `vm._data.xx`
> 5. 判断用户是否传入了 el 属性，内部会调用 $mount，此方法也可以用户自己调用
> 6. 对模板的优先级处理， render -> template -> el
> 7. 将模板编译成 函数，parserHTML 函数解析模板 -> ast 语法树，解析语法树生成 code -> render 函数
> 8. 通过 render 方法，生成虚拟 dom + 真实数据 = 真实 DOM
> 9. 根据虚拟节点 渲染成 真实节点

## AST 和 VNode

AST 是描述语法的，并没有用户自己的逻辑，只有语法解析出来的内容
VNode 是描述 dom 结构的，可以自己去扩展属性

## 更新流程

- 一个属性对应一个 dep，一个 dep 对于多个 watcher （因为属性可以在多个组件中使用）
- 一个 watcher 可以 对应多个 dep （因为一个组件中可以有多个属性）

> Vue 里面用到了观察者模式，默认组件渲染的时候，会创建一个 watcher（会渲染视图），当渲染视图的时候，会取 data 中对数据，会走每个属性的 get 方法（每个属性都有一个 dep），就让这个属性的 dep 记录 watcher ，同时让 watcher 也记住 dep。因为 dep 和 watcher 是多对多的关系（一个属性可能出现在多个组件中，一个组件中存在多个属性）；如果数据发生变化，会通知对应属性的 dep ，依次通知存放的 watcher 去更新

## Diff 算法

- 默认同层比较
