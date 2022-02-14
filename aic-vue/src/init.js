import initState from './state'

function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this

    vm.$options = options

    initState(vm)

    if (vm.$options.el) {
    }
  }
}

export default initMixin
