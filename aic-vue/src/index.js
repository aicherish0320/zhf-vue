import { initGlobalAPI } from './global-api'
import { initMixin } from './init'
import { lifecycleMixin } from './lifecycle'
import { renderMixin } from './render'

/*
  Vue 通过原型的模式来实现扩展的
*/
function Vue(options) {
  // 实现 Vue 的初始化功能
  this._init(options)
}

initMixin(Vue)
renderMixin(Vue)
lifecycleMixin(Vue)
initGlobalAPI(Vue)

export default Vue
