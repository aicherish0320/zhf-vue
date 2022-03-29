import Watcher from './observe/watcher'
import { patch } from './vnode/patch'

export function mountComponent(vm) {
  

  const updateComponent = () => {
    vm._update(vm._render())
  }
  callHook(vm, 'beforeCreate')
  new Watcher(vm, updateComponent, () => {}, true)

}

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this
    vm.$el= patch(vm.$el, vnode)
  }
}

export function callHook(vm, hook) {
  const handlers = vm.$options[hook]
  if (handlers) {
    handlers.forEach((fn) => fn.call(vm))
  }
}