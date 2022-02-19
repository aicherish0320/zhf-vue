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
  function isArray(val) {
    return Array.isArray(val);
  }

  // 获取数组的老的原型方法
  const oldArrayPrototype = Array.prototype; // 让 arrayMethods 通过 __proto__ 能获取到数组的方法

  const arrayMethods = Object.create(oldArrayPrototype); // 只有这7个方法可以导致数组发生变化

  const methods = ['push', 'pop', 'unshift', 'reverse', 'sort', 'splice', 'shift'];
  methods.forEach(method => {
    // 属性的查找，是先找自己身上的，找不到去原型上查找
    arrayMethods[method] = function () {
      console.log('数组的方法进行重写操作');
    };
  });

  class Observer {
    constructor(value) {
      if (isArray(value)) {
        // 更改数组原型方法
        value.__proto__ = arrayMethods;
      } else {
        // 核心就是循环对象
        this.walk(value);
      }
    }

    walk(data) {
      Object.keys(data).forEach(key => {
        // 要是用 defineProperty 重新定义
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
        // 闭包，value 会向上层查找
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
    // 如果 value 不是对象，那么就不用观察了
    if (!isObject(value)) {
      return;
    } // 需要对对象进行观测 （最外层必须是一个 {}， 不能是数组）
    // 如果一个数据已经被观测过了，就不要再进行观测了，用类来实现，观测过了就增加一个标识
    // 在观测的时候，可以先检测是否观测过了，如果观测过了就跳过检测


    return new Observer(value);
  }

  function initState(vm) {
    const opts = vm.$options;

    if (opts.data) {
      initData(vm);
    }
  }

  function initData(vm) {
    // 用户传入的数据
    let data = vm.$options.data; // 如果用户传递的是一个函数 则取函数的返回值作为data
    // 只有根实例的data可以一个对象
    // 需要将 data 变成响应式的 `Object.defineProperty`，重写 `data` 中的所有属性

    vm._data = data = isFunction(data) ? data.call(vm) : data;
    observe(data);

    for (const key in data) {
      proxy(vm, key, '_data');
    }
  } // 将数据代理带 vm 上


  function proxy(vm, key, source) {
    Object.defineProperty(vm, key, {
      get() {
        return vm[source][key];
      },

      set(newVal) {
        if (newVal !== value) {
          vm[source][key] = newVal;
        }
      }

    });
  }

  function initMixin(Vue) {
    // 后续组件化开发的时候 Vue.extend 可以创造一个子组件，子组件可以继承 Vue，子组件也可以调用
    // _init 方法
    Vue.prototype._init = function (options) {
      const vm = this; // 把用户的选项放到 vm 上，这样在其他方法中都可以获取到 options
      // 为了后续扩展的方法，都可以获取 $options 选项

      vm.$options = options;
      initState(vm);

      if (vm.$options.el) ;
    };
  }

  /*
    Vue 通过原型的模式来实现扩展的
  */

  function Vue(options) {
    // 实现 Vue 的初始化功能
    this._init(options);
  }

  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
