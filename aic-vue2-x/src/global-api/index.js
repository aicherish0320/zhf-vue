import { isObject, mergeOptions } from '../utils'

export function initGlobalAPI(Vue) {
  // 全局属性
  Vue.options = {}
  Vue.options._base = Vue
  /*
    {
      beforeCreate() {}
    }
  */
  Vue.mixin = function (options) {
    this.options = mergeOptions(this.options, options)

    return this
  }

  //存放全局组件的
  Vue.options.components = {}
  // Vue.component -> Vue.extend
  Vue.component = function (id, definition) {
    // definition 可以是对象或者函数
    let name = definition.name || id
    definition.name = name
    if (isObject(definition)) {
      definition = Vue.extend(definition)
    }

    Vue.options.components[name] = definition
  }
  // 会产生一个子类
  Vue.extend = function (opt) {
    const Super = this
    const Sub = function (options) {
      // 创造一个组件 其实就是 new 这个组件的类（组件的初始化）
      this._init(options)
    }
    // 继承原型方法
    Sub.prototype = Object.create(Super.prototype)
    // Object.create 会产生一个新的实例 子类的原型 此时constructor 会指向错误
    Sub.prototype.constructor = Sub
    // 需要让子类拿到 在Vue定义的全局组件
    // Sub.options = mergeOptions(Super.options, opt)

    // 子组件的方法
    // Sub.mixin = Vue.mixin
    return Sub
  }
}

/*
  * Object.create 实现
  function create(parentPrototype) {
    const Fn = function(){}
    Fn.prototype = parentPrototype
    return new Fn()
  }
*/
