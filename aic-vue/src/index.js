import { initMixin } from './init'

/*
  Vue 通过原型的模式来实现扩展的
*/
function Vue(options) {
  // 实现 Vue 的初始化功能
  this._init(options)
}

initMixin(Vue)

export default Vue
