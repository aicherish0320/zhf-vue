import { isObject, mergeOptions } from '../utils/index'

export function initGlobalAPI(Vue) {
  Vue.options = {}

  Vue.mixin = function (options) {
    // this => Vue
    this.options = mergeOptions(this.options, options)

    return
  }
  // 会产生一个子类
  // Vue.extend -> 子类 -> new 子类的时候会执行代码的初始化流程
  Vue.extend = function (opt) {
    const Super = this
    const Sub = function (options) {
      this._init(options)
    }
    // function create(parentPrototype) {
    //   const Fn = function () {}
    //   Fn.prototype = parentPrototype
    //   return new Fn()
    // }
    // 继承原型方法
    Sub.prototype = Object.create(Super.prototype)
    // console.log(Sub.prototype.__proto__ === Super.prototype) // true
    // Object.create 会产生一个新的实例作为 子类的原型 此时的 constructor 会指向错误
    Sub.prototype.constructor = Sub
    // 需要让子类 能拿到 我们 Vue 定义的全局组件
    // Sub.options = mergeOptions(Super.options, opt)

    Sub.mixin = Super.mixin

    return Sub
  }
  Vue.options.components = {}
  // Vue.component -> Vue.extend
  Vue.component = function (id, definition) {
    const name = definition.name || id
    definition.name = name

    if (isObject(definition)) {
      definition = Vue.extend(definition)
    }
    Vue.options.components[name] = definition
  }
}
