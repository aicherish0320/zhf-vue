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
  vm._data = data = isFunction(data) ? data.call(vm) : data

  observe(data)

  for (const key in data) {
    proxy(vm, key, '_data')
  }
}
// 将数据代理带 vm 上
// 取值的时候做代理，不是暴力的把 _data 属性赋予给 vm，而且直接赋值会有命名冲突问题
function proxy(vm, key, source) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(newVal) {
      if (newVal !== value) {
        vm[source][key] = newVal
      }
    }
  })
}
