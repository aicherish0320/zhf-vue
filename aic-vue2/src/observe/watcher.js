import { Dep } from './dep'
let id = 0
export class Watcher {
  constructor(vm, fn, cb, options) {
    this.vm = vm
    this.fn = fn
    this.cb = cb
    this.options = options
    this.id = id++

    this.deps = []
    this.depIds = new Set()

    this.getters = fn
    this.get()
  }
  get() {
    Dep.target = this
    this.getters()
    Dep.target = null
  }
  addDep(dep) {
    const { id } = dep
    if (!this.depIds.has(id)) {
      this.deps.push(dep)
      this.depIds.add(id)

      dep.addSub(this)
    }
  }
  update() {
    this.get()
  }
}
