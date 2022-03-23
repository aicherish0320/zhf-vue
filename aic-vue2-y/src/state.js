import { observe } from './observe/index.js'

export function initState(vm) {
  const opts = vm.$options
  if (opts.data) {
    initData(vm)
  }
}

function proxy(vm, key, source) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(newVal) {
      vm[source][key] = newVal
    }
  })
}

function initData(vm) {
 const data =  vm._data = vm.$options.data

  observe(vm._data)

  for (const key in data) {
    proxy(vm, key, '_data')
  }
}
