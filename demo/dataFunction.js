/**
 * 为什么 组件中的 data 为 function
 */

const obj1 = {}
const obj2 = function () {
  return {}
}

class Component {
  constructor() {
    // this.data = obj1
    this.data = obj2()
  }
}

new Component().data
new Component().data
