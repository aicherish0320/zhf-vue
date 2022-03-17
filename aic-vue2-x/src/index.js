import { initMixin } from './init'

// Vue是通过原型模式去实现的 所有的功能都通过原型扩展的方式来添加

function Vue(options) {
  this._init(options)
}

initMixin(Vue)

export default Vue
