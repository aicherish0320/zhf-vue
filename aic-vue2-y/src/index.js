import { compileToFunction } from './compiler/index'
import { initGlobalAPI } from './global-api/index'
import { initMixin } from './init'
import { lifecycleMixin } from './lifecycyle'
import { renderMixin } from './render'
import { createElm, patch } from './vnode/patch'

function Vue(options) {
  this._init(options)
}

initMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
initGlobalAPI(Vue)

// 生成一个虚拟节点
// const vm1 = new Vue({
//   data: {
//     name: 'aicherish'
//   }
// })
// const render1 = compileToFunction(`<ul>
// <li key="A" style="color: red">A</li>
// <li key="B" style="color: blue">B</li>
// <li key="C" style="color: green">C</li>
// </ul>`)
// const oldVNode = render1.call(vm1)
// const el1 = createElm(oldVNode)
// document.body.appendChild(el1)

// 生成另一个虚拟节点
// const vm2 = new Vue({
//   data: {
//     name: 'kac'
//   }
// })
// const render2 = compileToFunction(`<ul>
// <li key="E">E</li>
// <li key="B">B</li>
// <li key="G">G</li>
// </ul>`)
// const vNode = render2.call(vm2)

// setTimeout(() => {
//   patch(oldVNode, vNode)
// }, 4000);

export default Vue
