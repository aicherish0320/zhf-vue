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
    arrayMethods[method] = function (...args) {
      // 数组新增的属性 要看一下是不是对象 如果是对象 则继续进行劫持
      // 需要调用数组原生逻辑
      oldArrayPrototype[method].call(this, ...args); // TODO... 可以添加自己的逻辑 函数劫持 切片

      let inserted = null;
      let ob = this.__ob__;

      switch (method) {
        // 修改 删除 添加
        case 'splice':
          inserted = args.slice(2); // splice 方法从第三个参数起 是添加的新数据

          break;

        case 'push':
        case 'unshift':
          // 调用 push/unshift 传递的参数就是新增的逻辑
          inserted = args;
          break;
      } // inserted 遍历数组，看一个它是否需要进行再次劫持


      if (inserted) {
        ob.observeArray(inserted);
      }
    };
  });

  class Observer {
    constructor(value) {
      // 给对象和数组添加一个自定义属性
      Object.defineProperty(value, '__ob__', {
        enumerable: false,
        value: this
      });

      if (isArray(value)) {
        // 更改数组原型方法
        value.__proto__ = arrayMethods;
        this.observeArray(value);
      } else {
        // 核心就是循环对象
        this.walk(value);
      }
    } // 递归遍历数组，对数组内部的对象再次重写


    observeArray(data) {
      // 数组里面如果是引用类型那么是响应式的
      data.forEach(item => observe(item));
    }

    walk(data) {
      Object.keys(data).forEach(key => {
        // 使用 defineProperty 重新定义
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
        console.log('get >>> ', key, value); // 闭包，value 会向上层查找

        return value;
      },

      set(newVal) {
        if (value !== newVal) {
          console.log('set >>> ', key, newVal);
          observe(newVal);
          value = newVal;
        }
      }

    });
  }

  function observe(value) {
    // 如果 value 不是对象，那么就不用观察了
    if (!isObject(value)) {
      return;
    } // 一个对象不需要重新被观测


    if (value.__ob__) {
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
  // 取值的时候做代理，不是暴力的把 _data 属性赋予给 vm，而且直接赋值会有命名冲突问题


  function proxy(vm, key, source) {
    Object.defineProperty(vm, key, {
      get() {
        return vm[source][key];
      },

      set(newVal) {
        vm[source][key] = newVal;
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
