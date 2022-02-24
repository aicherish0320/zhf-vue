# 手写实现 Vue2.x （2）

## 1.环境搭建

使用 rollup 搭建开发环境，安装`rollup @babel/core @babel/preset-env rollup-plugin-babel`

## 2. Vue 的初始化流程

1. Vue 是通过混入的方式对 Vue 进行原型扩展
   > 通过 `initMixin` 混入 `_init` 方法，进行初始化，首先进行状态的初始化（data、props、computed、methods）
2. 数据响应式处理
   > 使用 `Object.defineProperty` 给数据添加`get/set`，进行数据劫持。
   > 普通对象使用`Object.defineProperty`进行数据劫持
   > 数组通过重写数组方法进行响应式处理
3. 模板编译
