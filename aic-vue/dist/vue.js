(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function genProps(attrs) {
    let str = ''; // { key: value, key: value }

    for (let i = 0; i < attrs.length; i++) {
      let attr = attrs[i];

      if (attr.name === 'style') {
        let styles = {};
        attr.value.replace(/([^;:]+):([^;:]+)/g, function () {
          styles[arguments[1].trim()] = arguments[2].trim();
        });
        attr.value = styles;
      }

      str += `${attr.name}:${JSON.stringify(attr.value)},`;
    }

    return `{${str.slice(0, -1)}}`;
  }

  function gen(el) {
    const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

    if (el.type === 1) {
      // 如果是元素就递归生成
      return generate(el);
    } else {
      let text = el.text; // 说明是普通文本

      if (!defaultTagRE.test(text)) {
        return `_v('${text}')`;
      } // <div>aa {{ name }} bb</div>
      // 说明有表达式。需要做一个表达式和普通值的拼接 _v('aaa', _s(name), 'bbb')


      let lastIndex = defaultTagRE.lastIndex = 0;
      let tokens = [];
      let match; // 如果正则 + g，lastIndex

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

  function genChildren(el) {
    let children = el.children;

    if (children) {
      return children.map(item => gen(item)).join(',');
    }

    return false;
  }

  function generate(ast) {
    let children = genChildren(ast);
    let code = `_c('${ast.tag}', ${ast.attrs.length ? genProps(ast.attrs) : undefined}${children ? `,${children}` : ''})`;
    return code;
  }

  function parseHTML(html) {
    // 正则
    const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 匹配标签名

    const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
    const startTagOpen = new RegExp(`^<${qnameCapture}`); // 匹配标签名

    const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结束 </aa>

    const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性

    const startTagClose = /^\s*(\/?)>/; // 匹配结束标签 > />
    // 构建父子关系

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
      // 遇到开始标签，就取栈中的最后一个 作为父级
      const parent = stack[stack.length - 1];
      let element = createASTElement(tag, attrs, parent); // 说明当前节点就是根节点

      if (root === null) {
        root = element;
      }

      if (parent) {
        // 更新父级节点
        element.parent = parent;
        parent.children.push(element);
      }

      stack.push(element);
    }

    function end(tag) {
      const endTag = stack.pop();

      if (endTag.tag !== tag) {
        console.log('标签出错了');
      }
    }

    function text(chars) {
      const parent = stack[stack.length - 1];
      chars = chars.replace(/\s/g, '');

      if (chars) {
        parent.children.push({
          type: 2,
          text: chars
        });
      }
    }

    function advance(len) {
      html = html.substring(len);
    }

    function parseStartTag() {
      const startMatch = html.match(startTagOpen);

      if (startMatch) {
        const match = {
          tagName: startMatch[1],
          attrs: []
        };
        advance(startMatch[0].length); // 匹配属性 1. 要有属性，2.不能为开始的结束标签

        let end, attr;

        while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
          advance(attr[0].length);
        }

        if (end) {
          advance(end[0].length);
        }

        return match;
      }

      return false;
    } // 不停的截取模板，直到把模板全部解析完毕


    while (html) {
      // 解析 标签和文本
      let index = html.indexOf('<');

      if (index === 0) {
        // 标签 解析开始标签 并且把属性也解析出来
        const startTagMatch = parseStartTag();

        if (startTagMatch) {
          // 开始标签
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }

        let endTagMatch;

        if (endTagMatch = html.match(endTag)) {
          // 结束标签
          end(endTagMatch[1]);
          advance(endTagMatch[0].length);
          continue;
        }

        break;
      } // 文本


      if (index > 0) {
        let chars = html.substring(0, index);
        text(chars);
        advance(chars.length);
      }
    }

    return root;
  }

  function compileToFunction(template) {
    // 1. 将模板编程 ast 语法树
    const ast = parseHTML(template); // 2. 代码优化 编辑静态节点
    // TODO
    // 3. 代码生成

    const code = generate(ast); // 模板引擎的实现原理都是 new Function + with

    const render = new Function(`with(this){return ${code}}`);
    return render;
  }

  let id$1 = 0;

  class Dep {
    // 把 watcher 放到 dep 中
    constructor() {
      this.subs = [];
      this.id = id$1++;
    }

    depend() {
      // 让 dep 记住这个 watcher
      // this.subs.push(Dep.target)
      Dep.target.addDep(this);
    }

    addSub(watcher) {
      // 让 dep 记住 watcher
      this.subs.push(watcher);
    }

    notify() {
      this.subs.forEach(w => w.update());
    }

  } // 这里用了一个全局的变量


  Dep.target = null;

  let id = 0;

  class Watcher {
    // 要将 dep 放到 watcher 中
    constructor(vm, fn, cb, options) {
      this.vm = vm;
      this.fn = fn;
      this.cb = cb;
      this.options = options;
      this.id = id++;
      this.depsId = new Set();
      this.deps = []; // fn 就是页面渲染逻辑

      this.getters = fn; // 表示一上来就做一次初始化

      this.get();
    }

    get() {
      // 利用了 js 单线程特性
      Dep.target = this; // 页面渲染的逻辑

      this.getters();
      Dep.target = null;
    }

    addDep(dep) {
      const dId = dep.id;

      if (!this.depsId.has(dId)) {
        this.depsId.add(dId);
        this.deps.push(dep);
        dep.addSub(this);
      }
    }

    update() {
      // 可以做异步更新处理
      this.get();
    }

  }

  function patch(el, vnode) {
    // 根据虚拟节点 渲染成真实节点
    const elm = createElm(vnode);
    const parentNode = el.parentNode;
    parentNode.insertBefore(elm, el.nextSibling);
    parentNode.removeChild(el); // 删除老节点 根据 vnode 创建新节点 替换掉老节点

    return elm;
  } // 面试问：虚拟节点的实现 虚拟节点 -> 真实节点

  function createElm(vnode) {
    const {
      tag,
      data,
      children,
      text,
      vm
    } = vnode; // 让虚拟节点和真实节点做一个映射，后续某个虚拟节点更新了 我们可以跟踪到真实节点，并且更新真实节点

    if (typeof tag === 'string') {
      vnode.el = document.createElement(tag);
      updateProperties(vnode.el, data);
      children.forEach(child => {
        vnode.el.appendChild(createElm(child));
      });
    } else {
      // 文本
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  }

  function updateProperties(el, props = {}) {
    for (let key in props) {
      el.setAttribute(key, props[key]);
    }
  }

  function mountComponent(vm) {
    const updateComponent = () => {
      vm._update(vm._render());
    }; // 每个组件 都有一个 watcher，我们把这个 watcher 称之为渲染 watcher


    new Watcher(vm, updateComponent, () => {
      console.log('后续添加更新钩子函数 update');
    }, true);
  }
  function lifecycleMixin(vue) {
    vue.prototype._update = function (vnode) {
      // 采用的是 先序深度遍历 创建节点 （遇到节点就创造节点，递归创建）
      const vm = this;
      vm.$el = patch(vm.$el, vnode);
    };
  }

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
    observe(value); // 每个属性对应一个 dep

    const dep = new Dep();
    Object.defineProperty(obj, key, {
      get() {
        if (Dep.target) {
          dep.depend();
        } // console.log('get >>> ', key, value)
        // 闭包，value 会向上层查找


        return value;
      },

      set(newVal) {
        if (value !== newVal) {
          // console.log('set >>> ', key, newVal)
          observe(newVal);
          value = newVal; // 拿到当前的 dep 里面的 watcher 依次执行

          dep.notify();
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

      if (vm.$options.el) {
        // 要将数据挂载到页面上
        // 数据变化需要更新视图，diff 算法更新需要更新的部分
        // vue -> template（写起来更方便）
        // vue3 -> template 写起来性能会更高，内部做了很多优化
        // template -> ast 语法树（用来描述语法的，虚拟 DOM 描述 DOM 节点）-> 描述成一个树结构 -> 将代码重组成 JS 语法
        // 模板编译原理：把template模板编译成 render 函数，render 函数返回 虚拟DOM -> diff 算法对比虚拟DOM
        // ast -> render -> vNode -> 真实DOM
        // 更新的时候 再次调用 render 生成新的vNode -> 新旧比对 -> 更新真实DOM
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      const vm = this;
      const opts = vm.$options; // 获取真实的元素

      el = document.querySelector(el); // 页面真实元素

      vm.$el = el;

      if (!opts.render) {
        // 模板编译
        let template = opts.template;

        if (!template) {
          template = el.outerHTML;
        }

        let render = compileToFunction(template);
        opts.render = render;
      }

      mountComponent(vm);
    };
  }

  // 返回虚拟节点
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
    // 创建元素
    Vue.prototype._c = function () {
      const vm = this;
      return createElement(vm, ...arguments);
    }; // 创建文本虚拟节点


    Vue.prototype._v = function (text) {
      const vm = this;
      return createText(vm, text);
    }; // stringify()


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

  /*
    Vue 通过原型的模式来实现扩展的
  */

  function Vue(options) {
    // 实现 Vue 的初始化功能
    this._init(options);
  }

  initMixin(Vue);
  renderMixin(Vue);
  lifecycleMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
