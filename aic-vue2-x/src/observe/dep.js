let id = 0

class Dep {
  constructor() {
    this.subs = []
    this.id = id++
  }

  depend() {
    // watcher 记住 dep
    Dep.target.addDep(this)
  }
  addSub(w) {
    // dep 记住 watcher
    this.subs.push(w)
  }
  notify(){
    this.subs.forEach(w => w.update())
  }
}
// 相当于 window.target
Dep.target = null

export default Dep
