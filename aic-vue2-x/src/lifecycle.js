import { patch } from "./vdom/patch"

export function mountComponent(vm) {
  vm._update(vm._render())
}

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vNode) {
    // 采用的是 先序深度遍历 创建节点 （遇到节点就创建节点、递归创建）
    const vm = this
    
    patch(vm.$el, vNode)
  }
}
