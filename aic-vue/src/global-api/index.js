import { mergeOptions } from '../utils'

export function initGlobalAPI(Vue) {
  // 全局属性，在每个组件初始化的时候 将这些属性放到每个组件上
  Vue.options = {}

  Vue.mixin = function (options) {
    this.options = mergeOptions(this.options, options)
    return this
  }
  Vue.component = function (options) {}
  Vue.filter = function (options) {}
  Vue.directive = function (options) {}
}
