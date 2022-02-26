import Watcher from './observe/watcher'
import { patch } from './vdom/patch'

export function mountComponent(vm) {
  const updateComponent = () => {
    vm._update(vm._render())
  }
  callHook(vm, 'beforeCreate')
  // 每个组件 都有一个 watcher，我们把这个 watcher 称之为渲染 watcher
  new Watcher(
    vm,
    updateComponent,
    () => {
      console.log('后续添加更新钩子函数 update')
      callHook(vm, 'created')
    },
    true
  )

  callHook(vm, 'mounted')
}

export function lifecycleMixin(vue) {
  vue.prototype._update = function (vnode) {
    // 采用的是 先序深度遍历 创建节点 （遇到节点就创造节点，递归创建）
    const vm = this

    vm.$el = patch(vm.$el, vnode)
  }
}

export function callHook(vm, hook) {
  const handlers = vm.$options[hook]
  if (handlers) {
    handlers.forEach((fn) => {
      // 生命周期的 this 永远指向实例
      fn.call(vm)
    })
  }
}
