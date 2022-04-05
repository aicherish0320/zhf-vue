import Watcher from './observe/watcher'
import { patch } from './vdom/patch'

export function mountComponent(vm) {
  const updateComponent = () => {
    vm._update(vm._render())
  }

  callHook(vm, 'beforeCreate')
  // 每个组件都有一个 watcher，我们把这个 watcher 称之为渲染 watcher
  new Watcher(
    vm,
    updateComponent,
    () => {
      console.log('后续增添更新钩子函数')
      callHook(vm, 'created')
    },
    true
  )
  callHook(vm, 'mounted')
}

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vNode) {
    // 采用的是 先序深度遍历 创建节点 （遇到节点就创建节点、递归创建）
    const vm = this
    // 第一次渲染，是根据虚拟节点，生成真实节点，替换原来的节点
    // 第二次，生成一个新的虚拟节点，和老的虚拟节点进行比对
    vm.$el = patch(vm.$el, vNode)
  }
}

export function callHook(vm, hook) {
  const handlers = vm.$options[hook]
  if (handlers) {
    handlers.forEach((fn) => fn.call(vm))
  }
}
