import { compileToFunction } from './compiler/index'
import { mountComponent } from './lifecycyle'
import { initState } from './state'
import { mergeOptions } from './utils/index'

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    vm.$options = options
    // 全局定义的内容 会混合在当前实例上
    vm.$options = mergeOptions(vm.constructor.options, options)

    initState(vm)

    if (options.el) {
      this.$mount(vm)
    }
  }

  Vue.prototype.$mount = function (vm) {
    const opts = vm.$options
    const el = (vm.$el = document.querySelector(opts.el))

    if (!opts.render) {
      let template = opts.template
      if (!template) {
        template = el.outerHTML
      }
      opts.render = compileToFunction(template)
    }

    mountComponent(vm)
  }
}
