(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function compileToFunction(el) {
    // template -> ast -> render
    parseHTML(el);
  }
  /*

  <div id="app">
    <p>{{ foo }}</p>
  </div>

  {
    tag: id,
    attrs: {},
    children: {

    }
  }

  */

  function parseHTML(html) {
    const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 匹配标签名

    const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
    const startTagOpen = new RegExp(`^<${qnameCapture}`); // 匹配开始标签名

    const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结束 </aa>

    const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性

    const startTagClose = /^\s*(\/?)>/; // 匹配结束标签 > />

    let stack = [];
    let root = null;

    function createASTElement(tag, attrs, parent = null) {
      return {
        tag,
        type: 1,
        children: [],
        parent,
        attrs
      };
    }

    function start(tag, attrs) {
      const parent = stack[stack.length - 1];
      const element = createASTElement(tag, attrs, parent);

      if (!root) {
        root = element;
      }

      if (parent) {
        element.parent = parent;
        parent.children.push(element);
      }

      stack.push(element);
    }

    function text(text) {
      const parent = stack[stack.length - 1];
      text = text.replace(/\s/g, '');

      if (text) {
        parent.children.push({
          type: 2,
          text
        });
      }
    }

    function end(tag) {
      stack.pop();
    }

    while (html) {
      let index = html.indexOf('<');

      if (index === 0) {
        const startTagMatch = parseStartTag();

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }

        let endTagMatch;

        if (endTagMatch = html.match(endTag)) {
          end(endTagMatch[1]);
          advance(endTagMatch[0].length);
          continue;
        }
      } // 文本


      if (index > 0) {
        let chars = html.substring(0, index);
        text(chars);
        advance(chars.length);
      }
    }

    function parseStartTag() {
      const startMatch = html.match(startTagOpen);

      if (startMatch) {
        const match = {
          tagName: startMatch[1],
          attrs: []
        };
        advance(startMatch[0].length); // 匹配属性

        let end, attr;

        while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[4]
          });
          advance(attr[0].length);
        }

        if (end) {
          advance(end[0].length);
        }

        return match;
      }

      return false;
    }

    function advance(len) {
      html = html.substring(len);
    }

    console.log(root);
  }

  const isFunction = v => typeof v === 'function';
  const isObject = v => typeof v === 'object' && v !== null;

  const oldArrayPrototype = Array.prototype;
  const arrayProto = Object.create(oldArrayPrototype);
  const methods = ['push', 'pop', 'shift', 'unshift', 'sort', 'splice', 'reverse'];
  methods.forEach(m => {
    arrayProto[m] = function (...args) {
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

      initState(vm); // 挂载

      if (this.$options.el) {
        this.$mount(this.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      const vm = this;
      const options = this.$options;
      el = document.querySelector(el);
      vm.$el = el;

      if (!vm.render) {
        let template = options.template;

        if (!template) {
          template = el.outerHTML;
        }

        options.render = compileToFunction(template);
      }
    };
  }

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
