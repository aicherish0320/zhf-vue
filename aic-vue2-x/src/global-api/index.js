import { mergeOptions } from "../utils"

export function initGlobalAPI(Vue) {
  // 全局属性
  Vue.options = {}

  Vue.mixin = function (options) {
    this.options = mergeOptions(this.options, options)
   
    return this
  }
  Vue.component = function (options) {}
  Vue.directive = function (options) {}
  Vue.filter = function (options) {}
}
