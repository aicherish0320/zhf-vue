import Dep from './dep'

let id = 0
class Watcher {
  constructor(vm, fn, cb, options) {
    this.id = id++
    this.vm = vm
    this.fn = fn
    this.cb = cb
    this.options = options
    this.depsId = new Set()
    this.deps = []
    // getter: 页面渲染逻辑
    this.getter = fn
    // 表示一进来就做一次初始化
    this.get()
  }

  get() {
    Dep.target = this
    // 页面渲染的逻辑
    this.getter()
    // 只有渲染的时候才会进行依赖收集
    Dep.target = null
  }
  addDep(dep) {
    let id = dep.id
    if (!this.depsId.has(id)) {
      this.depsId.add(id)
      this.deps.push(dep)
      dep.addSub(this)
    }
  }
  update() {
    this.get()
  }
}

export default Watcher
