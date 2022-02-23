let id = 0

class Dep {
  // 把 watcher 放到 dep 中
  constructor() {
    this.subs = []
    this.id = id++
  }
  depend() {
    // 让 dep 记住这个 watcher
    this.subs.push(Dep.target)
  }
}

// 这里用了一个全局的变量
Dep.target = null

export default Dep
