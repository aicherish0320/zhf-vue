let id = 0

class Dep {
  constructor() {
    this.id = id++
    this.subs = []
  }
  depend() {
    Dep.target&& Dep.target.addDep(this)
  }
  addSub(w) {
    this.subs.push(w)
  }
  notify() {
    this.subs.forEach(w => w.update())
  }
}

export default Dep
