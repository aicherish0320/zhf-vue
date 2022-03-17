import { observe } from './observe/index.js'
import { isFunc } from './utils'

export function initState(vm) {
  const opts = vm.$options

  if (opts.data) {
    initData(vm)
  }
}

// 数据的初始化
function initData(vm) {
  let data = vm.$options.data
  // 只有根实例 data 才可以是一个对象，组件的 data 只能为函数
  data = isFunc(data) ? data.call(vm) : data
  // 需要将 data 变成响应式的 Object.defineProperty，重写 data 中的所有属性
  // 观测数据
  observe(data)
}
