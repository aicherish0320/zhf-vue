import { observe } from './observe'
import { isFunction } from './utils'

export function initState(vm) {
  let data = vm.$options.data
  vm._data = data = isFunction(data) ? data.call(vm) : data

  // 数据响应式处理
  observe(data)

  // 将数据代理到 vm 实例上，方便用于使用
  for (const key in data) {
    proxy(vm, key, '_data')
  }
}

function proxy(vm, key, source) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(val) {
      vm[source][key] = val
    }
  })
}
