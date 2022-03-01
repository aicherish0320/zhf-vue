import { Watcher } from './observe/watcher'
import { patch } from './vdom/patch'

export function mountComponent(vm) {
  const updateComponent = () => {
    vm._update(vm._render())
  }
  callHook(vm, 'beforeCreate')

  new Watcher(
    vm,
    updateComponent,
    () => {
      callHook(vm, 'created')
    },
    true
  )

  callHook(vm, 'mounted')
}
export function lifecycleMixin(vue) {
  vue.prototype._update = function (vnode) {
    const vm = this

    vm.$el = patch(vm.$el, vnode)
  }
}

export function callHook(vm, hook) {
  const handlers = vm.$options[hook]
  if (handlers) {
    handlers.forEach((fn) => {
      fn.call(vm)
    })
  }
}
