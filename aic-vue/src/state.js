import { observe } from './observe'
import { isFunction } from './utils'

function initState(vm) {
  const opts = vm.$options
  if (opts.data) {
    initData(vm)
  }
}

function initData(vm) {
  let data = vm.$options.data
  data = isFunction(data) ? data.call(vm) : data

  observe(data)

  console.log(data)
}

export default initState
