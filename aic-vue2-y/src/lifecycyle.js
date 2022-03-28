import Watcher from './observe/watcher'
import { patch } from './vnode/patch'

export function mountComponent(vm) {
  

  const updateComponent = () => {
    vm._update(vm._render())
  }

  new Watcher(vm, updateComponent, () => {}, true)

}

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this
    vm.$el= patch(vm.$el, vnode)
  }
}
