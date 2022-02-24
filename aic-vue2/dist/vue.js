(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  const isFunction = v => typeof v === 'function';
  const isObject = v => typeof v === 'object' && v !== null;

  const oldArrayPrototype = Array.prototype;
  const arrayProto = Object.create(oldArrayPrototype);
  const methods = ['push', 'pop', 'shift', 'unshift', 'sort', 'splice', 'reverse'];
  methods.forEach(m => {
    arrayProto[m] = function (...args) {
      console.log('劫持数组', m);
      oldArrayPrototype[m].call(this, ...args);
      let inserted;

      switch (m) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          inserted = args.slice(2);
          break;
      }

      if (inserted) {
        const ob = this.__ob__;
        ob.observeArray(inserted);
      }
    };
  });

  class Observer {
    constructor(data) {
      if (Array.isArray(data)) {
        Object.defineProperty(data, '__ob__', {
          enumerable: false,
          value: this
        });
        data.__proto__ = arrayProto;
        this.observeArray(data);
      } else {
        this.walk(data);
      }
    }

    walk(data) {
      Object.keys(data).forEach(key => {
        defineReactive(data, key, data[key]);
      });
    }

    observeArray(data) {
      data.forEach(item => {
        observe(item);
      });
    }

  }

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

  function observe(data) {
    if (!isObject(data)) {
      return;
    }

    new Observer(data);
  }

  function initState(vm) {
    let data = vm.$options.data;
    vm._data = data = isFunction(data) ? data.call(vm) : data; // 数据响应式处理

    observe(data); // 将数据代理到 vm 实例上，方便用于使用

    for (const key in data) {
      proxy(vm, key, '_data');
    }
  }

  function proxy(vm, key, source) {
    Object.defineProperty(vm, key, {
      get() {
        return vm[source][key];
      },

      set(val) {
        vm[source][key] = val;
      }

    });
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      const vm = this;
      vm.$options = options; // 初始化状态

      initState(vm);
    };
  }

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
