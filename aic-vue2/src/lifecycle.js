import { patch } from './vdom/patch'

export function mountComponent(vm) {
  const updateComponent = () => {
    vm._update(vm._render())
  }
  updateComponent()
}
export function lifecycleMixin(vue) {
  vue.prototype._update = function (vnode) {
    const vm = this

    vm.$el = patch(vm.$el, vnode)
  }
}
