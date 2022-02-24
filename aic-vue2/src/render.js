import { isObject } from './utils'
import { createElement, createText } from './vdom'

export function renderMixin(Vue) {
  Vue.prototype._c = function () {
    const vm = this
    return createElement(vm, ...arguments)
  }
  Vue.prototype._v = function (text) {
    const vm = this
    return createText(vm, text)
  }
  Vue.prototype._s = function (val) {
    if (isObject(val)) {
      return JSON.stringify(val)
    }
    return val
  }

  Vue.prototype._render = function () {
    const vm = this

    const { render } = vm.$options

    const vnode = render.call(vm)
    return vnode
  }
}
