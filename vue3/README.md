# Vue3 和 Vue2 的区别

- Vue3 最主要的特点就是：**小** 和 **快**
- 移除了 Vue2 中不常用的内容 （过滤器、组件 Vue3 可以按需打包，借助了 rollup 可以支持函数的 treeShaking，提供了一些新增的组件）
- 只是兼容了 Vue2 核心 API，不在考虑 IE11 下的兼容性问题
- 快：proxy，defineProperty/Proxy
  - defineProperty 递归 和 重写属性
  - proxy 天生的拦截器，不需要重写属性，懒递归
- 整体 Vue3 架构发生了变化（采用了 monorepo ，可以分层清晰，一个项目中维护多个项目，可以利用项目中的某个部分）
- src
  - observe
  - vdom
- platform
  - weex
  - vue
- Vue3 对编译时的内容 进行了重写 template -> render 函数 静态编辑还有属性标记 patchFlag 动态标记（比较哪些元素包含哪些属性），静态提升、函数的缓存。Vue3 使用了最长子序列重写了 diff 算法（这个和 Vue2 基本没有太大差异），使用了 Vue3 模板内部有一个概念叫 blockTree。在 Vue 中使用 jsx 就不会得到模板的优化。可以在写 jsx 的时候，自己去标记。

- Vue3 完全采用了 ts 来进行重构，对 ts 兼容非常好
- Composition API，便于代码的分离、重用
