import Dep from './dep'

class Watcher {
  // 要将 dep 放到 watcher 中
  constructor(vm, fn, cb, options) {
    this.vm = vm
    this.fn = fn
    this.cb = cb
    this.options = options
    // fn 就是页面渲染逻辑
    this.getters = fn
    // 表示一上来就做一次初始化
    this.get()
  }
  get() {
    // 利用了 js 单线程特性
    Dep.target = this
    // 页面渲染的逻辑
    this.getters()
    Dep.target = null
  }
}

export default Watcher
