import { Watcher } from './observe/watcher'
import { patch } from './vdom/patch'

export function mountComponent(vm) {
  const updateComponent = () => {
    vm._update(vm._render())
  }

  new Watcher(vm, updateComponent, () => {}, true)
}
export function lifecycleMixin(vue) {
  vue.prototype._update = function (vnode) {
    const vm = this

    vm.$el = patch(vm.$el, vnode)
  }
}
