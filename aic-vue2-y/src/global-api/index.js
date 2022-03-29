import { mergeOptions } from "../utils/index"

export function initGlobalAPI(Vue) {
  Vue.options = {}

  Vue.mixin = function(options){
    this.options = mergeOptions(this.options, options)

    return
  }
}