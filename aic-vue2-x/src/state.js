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
  vm._data = data = isFunc(data) ? data.call(vm) : data
  // 需要将 data 变成响应式的 Object.defineProperty，重写 data 中的所有属性
  // 观测数据
  observe(data)
  // 将属性代理到 vm 实例上
  for (const key in data) {
    proxy(vm, key, '_data')
  }
}

function proxy(vm, key, source) {
  // source -> _data 已经是响应式的
  // 取值的时候再做代理，不是暴力的把 _data 属性赋予给 vm ，而且直接赋值有命名冲突问题
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(newVal) {
      vm[source][key] = newVal
    }
  })
}
