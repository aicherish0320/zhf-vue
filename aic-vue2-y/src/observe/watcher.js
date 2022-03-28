import { queueWatcher } from "../scheduler"
import Dep from "./dep"

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

    this.getter = fn

    this.get()
  }

  get() {
    Dep.target = this
    this.getter()
    Dep.target = null
  }

  addDep(dep) {
    const did = dep.id
    if(!this.depsId.has(did)) {
      this.depsId.add(did)
      this.deps.push(dep)

      dep.addSub(this)
    }
  }

  update() {
    // this.get()
    queueWatcher(this)
    console.log('update >>> ', )
  }
  run(){
    console.log('run >>> ', )
    this.get()
  }
}


export default Watcher