(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function isFunction(data) {
    return typeof data === 'function';
  }
  function isObject(val) {
    return typeof val === 'object' && val !== null;
  }

  class Observer {
    constructor(value) {
      this.walk(value);
    }

    walk(data) {
      Object.keys(data).forEach(key => {
        defineReactive(data, key, data[key]);
      });
    }

  }
  /*
    性能优化的原则
      1. 不要把所有的数据都放在 data 中
      2. 不要写数据的时候，层次过深；尽量扁平化数据
      3. 不要频繁获取数据
      4. 数据不需要响应式，可以使用 Object.freeze 冻结属性
  */


  function defineReactive(obj, key, value) {
    observe(value);
    Object.defineProperty(obj, key, {
      get() {
        return value;
      },

      set(newVal) {
        if (value !== newVal) {
          value = newVal;
        }
      }

    });
  }

  function observe(value) {
    if (!isObject(value)) {
      return;
    }

    return new Observer(value);
  }

  function initState(vm) {
    const opts = vm.$options;

    if (opts.data) {
      initData(vm);
    }
  }

  function initData(vm) {
    let data = vm.$options.data;
    data = isFunction(data) ? data.call(vm) : data;
    observe(data);
    console.log(data);
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      const vm = this;
      vm.$options = options;
      initState(vm);

      if (vm.$options.el) ;
    };
  }

  /*
    Vue 通过原型的模式来实现扩展的
  */

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
