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
   ...
5. 如果有 `el` 需要挂载到页面上

6. 如果更新对象不存在的属性，会导致视图不更新，如果是数组更新索引和长度不会触发更新
7. 如果是替换成一个新对象，新对象会被进行劫持，如果是数组存放新内容 （push/unshift） 新增的内容也会被劫持
8. 通过`__ob__`进行标识这个对象被监控过
9. `$set`: 内部就是使用 `splice()`

数组也可以使用 `defineProperty` 但是我们很少去采用 `arr[1] = xxx`
如果数组也是用了 defineProperty 还是可以实现修改索引触发更新，但是这种操作概率很低，索引源码没有采用这个方法

Vue2 中，数组修改索引不会导致视图更新，修改 length 也不会更新

Vue3 为了兼容 proxy 内部对数组用的就是 `defineProperty`

正常用户修改数组，无非采用数组的变异方法，push/pop/slice/shift/unshift/reverse/sort

1. 每个对象都有一个`__proto__`属性，它指向所属类的原型 `fn.__proto__ = Function.prototype`
2. 每个原型上都有一个`constructor`属性，指向函数本身`Function.prototype.constructor = Function`

3. 编译原理
4. 响应式原理，依赖收集
5. 组件化开发 （贯穿了 vue 的流程）
6. diff 算法

> 1. 默认会调用 `Vue._init` 方法将用户的参数挂载到 `$options`选项中， `vm.$options`
> 2. `Vue` 会根据用户的参数进行数据的初始化 props、computed、watch，会获取到对象作为数据,可以通过`vm._data`访问到用户的数据
> 3. 对数据进行观测，对象（递归使用的 defineProperty）、数组（方法的重写）劫持到用户的操作，比如：用户修改了数据 -> 更新视图
> 4. 将数据代理到 vm 对象上， `vm.xx => vm._data.xx`
> 5. 判断用户是否传入了 el 属性，内部会调用 $mount 方法，此方法也可以用户自己调用
> 6. 对模版的优先级处理 render/template/el,outerHTML
> 7. 将模板编译成函数， 解析模板 -> ast 语法树，解析语法树生成 code -> render 函数
> 8. 通过 render 方法，生成虚拟 dom + 真是数据 -> 真实的 dom
> 9. 根据虚拟节点渲染成真实节点

## 依赖收集

只有根组件的情况

1. Vue 里面用到了观察者模式，默认组件渲染的时候，会创建一个 watcher （并且会渲染视图）
2. 当渲染视图的时候，会取 data 中的数据，会走每个属性的 get 方法，就让这个属性的 dep 记录 watcher
3. 同时让 watcher 也记住 dep，dep 和 watcher 是多对多的关系，因为一个属性可能对应多个视图，一个视图对应多个数据
4. 如果数据发生变化，会通知对应属性的 dep，依次通知存放的 watcher 去更新

## 数组的依赖收集

>
