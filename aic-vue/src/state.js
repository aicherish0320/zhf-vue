import { observe } from './observe'
import { isFunction } from './utils'

export function initState(vm) {
  const opts = vm.$options
  if (opts.data) {
    initData(vm)
  }
}

function initData(vm) {
  // 用户传入的数据
  let data = vm.$options.data
  // 如果用户传递的是一个函数 则取函数的返回值作为data
  // 只有根实例的data可以一个对象
  // 需要将 data 变成响应式的 `Object.defineProperty`，重写 `data` 中的所有属性
  data = isFunction(data) ? data.call(vm) : data

  observe(data)

  console.log(data)
}
