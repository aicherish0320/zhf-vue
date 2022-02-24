import { compileToFunction } from './compiler'
import { mountComponent } from './lifecycle'
import { initState } from './state'

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    vm.$options = options
    // 初始化状态
    initState(vm)

    // 挂载
    if (this.$options.el) {
      this.$mount(this.$options.el)
    }
  }

  Vue.prototype.$mount = function (el) {
    const vm = this
    const options = this.$options

    el = document.querySelector(el)

    vm.$el = el

    if (!vm.render) {
      let template = options.template
      if (!template) {
        template = el.outerHTML
      }

      options.render = compileToFunction(template)
    }
    mountComponent(vm)
  }
}
