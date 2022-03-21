import { compileToFunction } from './compiler/index'
import { initState } from './state'

export function initMixin(Vue) {
  // 后续组件化开发的时候 Vue.extend 可以创造一个子组件，子组件可以继承Vue，
  // 子组件也可以调用 _init 方法
  Vue.prototype._init = function (options) {
    const vm = this
    // 为了后续扩展的方法，都可以获取到 options
    vm.$options = options
    // 把用户的选项放到 vm 上，这样在其他方法中都可以获取到 options

    initState(vm)

    if (vm.$options.el) {
      // 要将数据挂载到页面上
      /*
        template -> ast（用来描述语法的，描述语法本身的） -> 描述成一个树结构 -> 将代码重组成 js 语法
        模板编译原理 （把 template 模板编译成 render 函数）-> 虚拟DOM -> diff 算法对比虚拟DOM
        ast -> render -> 返回 VNode -> 生成真实 dom
        更新的时候再次调用 render -> 新的 VNode -> 新旧比对 -> 更新真实 dom
      */

      this.$mount(vm.$options.el)
    }
  }

  Vue.prototype.$mount = function (el) {
    const vm = this
    const opts = vm.$options
    el = document.querySelector(el)
    vm.$el = el

    if (!opts.render) {
      let template = opts.template
      if (!template) {
        template = el.outerHTML
      }
      let render = compileToFunction(template)
      opts.render = render
    }

    // opts.render
  }
}
