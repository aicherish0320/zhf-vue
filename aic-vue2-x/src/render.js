import { isObject } from './utils.js'
import { createElement, createText } from './vdom/index.js'

export function renderMixin(Vue) {
  // createElement
  Vue.prototype._c = function () {
    const vm = this
    // vm 表示是谁的虚拟节点
    return createElement(vm, ...arguments)
  }
  // 创建文本
  Vue.prototype._v = function (text) {
    const vm = this
    return createText(vm, text)
  }
  // stringify
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
