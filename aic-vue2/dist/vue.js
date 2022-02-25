(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function generate(ast) {
    let children = genChildren(ast);
    let code = `_c('${ast.tag}',${ast.attrs.length ? genProps(ast.attrs) : undefined}${children ? `,${children}` : ''})`;
    return code;
  }

  function genChildren(el) {
    const children = el.children;

    if (children) {
      return children.map(child => gen(child)).join(',');
    }

    return false;
  }

  function gen(el) {
    const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

    if (el.type === 1) {
      return generate(el);
    } else {
      const text = el.text;

      if (!defaultTagRE.test(text)) {
        return `_v('${text}')`;
      } // 如果正则 + g，配合 exec 就会有一个问题 lastIndex


      let lastIndex = defaultTagRE.lastIndex = 0;
      let match,
          tokens = [];

      while (match = defaultTagRE.exec(text)) {
        let index = match.index;

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }

        tokens.push(`_s(${match[1].trim()})`);
        lastIndex = index + match[0].length;
      }

      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }

      return `_v(${tokens.join('+')})`;
    }
  }

  function genProps(attrs) {
    let str = '';

    for (let i = 0; i < attrs.length; i++) {
      const attr = attrs[i];

      if (attr.name === 'style') {
        const styles = {};
        attr.value.replace(/([^;:]+):([^;:]+)/g, function () {
          styles[arguments[1].trim()] = arguments[2].trim();
        });
        attr.value = styles;
      }

      str += `${attr.name}:${JSON.stringify(attr.value)},`;
    }

    return `{${str.slice(0, -1)}}`;
  }

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

    return root;
  }

  function compileToFunction(el) {
    // template -> ast -> render
    const ast = parseHTML(el);
    const code = generate(ast);
    console.log(code);
    const render = new Function(`with(this){ return ${code} }`);
    return render;
  }

  let id$1 = 0;
  class Dep {
    constructor() {
      this.subs = [];
      this.id = id$1++;
    }

    depend() {
      Dep.target.addDep(this);
    }

    addSub(watcher) {
      this.subs.push(watcher);
    }

    notify() {
      this.subs.forEach(w => w.update());
    }

  }

  let id = 0;
  class Watcher {
    constructor(vm, fn, cb, options) {
      this.vm = vm;
      this.fn = fn;
      this.cb = cb;
      this.options = options;
      this.id = id++;
      this.deps = [];
      this.depIds = new Set();
      this.getters = fn;
      this.get();
    }

    get() {
      Dep.target = this;
      this.getters();
      Dep.target = null;
    }

    addDep(dep) {
      const {
        id
      } = dep;

      if (!this.depIds.has(id)) {
        this.deps.push(dep);
        this.depIds.add(id);
        dep.addSub(this);
      }
    }

    update() {
      this.get();
    }

  }

  function patch(el, vnode) {
    const elm = createElm(vnode);
    const parentNode = el.parentNode;
    parentNode.insertBefore(elm, el.nextSibling);
    parentNode.removeChild(el);
    return elm;
  }

  function createElm(vnode) {
    const {
      tag,
      data,
      children,
      text,
      vm
    } = vnode;

    if (typeof tag === 'string') {
      vnode.el = document.createElement(tag);
      children.forEach(child => {
        vnode.el.appendChild(createElm(child));
      });
    } else {
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  }

  function mountComponent(vm) {
    const updateComponent = () => {
      vm._update(vm._render());
    };

    new Watcher(vm, updateComponent, () => {}, true);
  }
  function lifecycleMixin(vue) {
    vue.prototype._update = function (vnode) {
      const vm = this;
      vm.$el = patch(vm.$el, vnode);
    };
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
    const dep = new Dep();
    Object.defineProperty(obj, key, {
      get() {
        if (Dep.target) {
          dep.depend();
        }

        return value;
      },

      set(newVal) {
        if (value !== newVal) {
          value = newVal;
          dep.notify();
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

      mountComponent(vm);
    };
  }

  function createElement(vm, tag, data = {}, ...children) {
    return vnode(vm, tag, data, children, data.key, undefined);
  }
  function createText(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text);
  }

  function vnode(vm, tag, data, children, key, text) {
    return {
      vm,
      tag,
      data,
      children,
      key,
      text
    };
  }

  function renderMixin(Vue) {
    Vue.prototype._c = function () {
      const vm = this;
      return createElement(vm, ...arguments);
    };

    Vue.prototype._v = function (text) {
      const vm = this;
      return createText(vm, text);
    };

    Vue.prototype._s = function (val) {
      if (isObject(val)) {
        return JSON.stringify(val);
      }

      return val;
    };

    Vue.prototype._render = function () {
      const vm = this;
      const {
        render
      } = vm.$options;
      const vnode = render.call(vm);
      return vnode;
    };
  }

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue);
  renderMixin(Vue);
  lifecycleMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
