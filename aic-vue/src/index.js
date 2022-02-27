import { compileToFunction } from './compiler'
import { initGlobalAPI } from './global-api'
import { initMixin } from './init'
import { lifecycleMixin } from './lifecycle'
import { renderMixin } from './render'
import { createElm, patch } from './vdom/patch'

/*
  Vue 通过原型的模式来实现扩展的
*/
function Vue(options) {
  // 实现 Vue 的初始化功能
  this._init(options)
}

initMixin(Vue)
renderMixin(Vue)
lifecycleMixin(Vue)
initGlobalAPI(Vue)

// 先生成一个虚拟节点
const vm1 = new Vue({
  data() {
    return {
      name: 'aicherish'
    }
  }
})
const render1 = compileToFunction(`<div >
  <li key="E">E</li>
  <li key="A">A</li>
  <li key="B">B</li>
  <li key="C">C</li>
  <li key="D">D</li>
</div>`)
const oldVNode = render1.call(vm1)
const el1 = createElm(oldVNode)
document.body.appendChild(el1)
// 新的虚拟节点
const vm2 = new Vue({
  data() {
    return {
      name: 'aic'
    }
  }
})
const render2 = compileToFunction(`<div >
  <li key="D" style="color: cyan">D</li>
  <li key="C" style="color: orange">C</li>
  <li key="B" style="color: green">B</li>
  <li key="A" style="color: red">A</li>
</div>`)
const newVNode = render2.call(vm2)
setTimeout(() => {
  patch(oldVNode, newVNode)
}, 2000)

export default Vue
