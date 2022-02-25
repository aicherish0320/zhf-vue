import { compileToFunction } from './compiler'
import { mountComponent } from './lifecycle'
import { initState } from './state'
import { nextTick } from './utils'

export function initMixin(Vue) {
  // 后续组件化开发的时候 Vue.extend 可以创造一个子组件，子组件可以继承 Vue，子组件也可以调用
  // _init 方法
  Vue.prototype._init = function (options) {
    const vm = this
    // 把用户的选项放到 vm 上，这样在其他方法中都可以获取到 options
    // 为了后续扩展的方法，都可以获取 $options 选项
    vm.$options = options

    initState(vm)

    if (vm.$options.el) {
      // 要将数据挂载到页面上
      // 数据变化需要更新视图，diff 算法更新需要更新的部分
      // vue -> template（写起来更方便）
      // vue3 -> template 写起来性能会更高，内部做了很多优化
      // template -> ast 语法树（用来描述语法的，虚拟 DOM 描述 DOM 节点）-> 描述成一个树结构 -> 将代码重组成 JS 语法
      // 模板编译原理：把template模板编译成 render 函数，render 函数返回 虚拟DOM -> diff 算法对比虚拟DOM
      // ast -> render -> vNode -> 真实DOM
      // 更新的时候 再次调用 render 生成新的vNode -> 新旧比对 -> 更新真实DOM
      vm.$mount(vm.$options.el)
    }
  }
  Vue.prototype.$mount = function (el) {
    const vm = this
    const opts = vm.$options
    // 获取真实的元素
    el = document.querySelector(el)
    // 页面真实元素
    vm.$el = el

    if (!opts.render) {
      // 模板编译
      let template = opts.template
      if (!template) {
        template = el.outerHTML
      }

      let render = compileToFunction(template)
      opts.render = render
    }
    mountComponent(vm)
  }
  Vue.prototype.$nextTick = nextTick
}
