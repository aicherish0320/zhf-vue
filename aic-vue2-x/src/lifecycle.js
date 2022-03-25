import Watcher from './observe/watcher'
import { patch } from './vdom/patch'

export function mountComponent(vm) {
  const updateComponent = () => {
    vm._update(vm._render())
  }
  // 每个组件都有一个 watcher，我们把这个 watcher 称之为渲染 watcher
  new Watcher(
    vm,
    updateComponent,
    () => {
      console.log('后续增添更新钩子函数')
    },
    true
  )
}

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vNode) {
    // 采用的是 先序深度遍历 创建节点 （遇到节点就创建节点、递归创建）
    const vm = this

    vm.$el = patch(vm.$el, vNode)
  }
}
