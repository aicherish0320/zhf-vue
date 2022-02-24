import Dep from './dep'
let id = 0
class Watcher {
  // 要将 dep 放到 watcher 中
  constructor(vm, fn, cb, options) {
    this.vm = vm
    this.fn = fn
    this.cb = cb
    this.options = options

    this.id = id++

    this.depsId = new Set()
    this.deps = []
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
  addDep(dep) {
    const dId = dep.id

    if (!this.depsId.has(dId)) {
      this.depsId.add(dId)
      this.deps.push(dep)

      dep.addSub(this)
    }
  }
  update() {
    // 可以做异步更新处理
    this.get()
  }
}

export default Watcher
