import { compileToFunction } from './compiler/index.js'
import { initGlobalAPI } from './global-api/index.js'
import { initMixin } from './init'
import { lifecycleMixin } from './lifecycle'
import { renderMixin } from './render'
import { createElm, patch } from './vdom/patch.js'

// Vue是通过原型模式去实现的 所有的功能都通过原型扩展的方式来添加

function Vue(options) {
  this._init(options)
}

initMixin(Vue)
renderMixin(Vue)
lifecycleMixin(Vue)
initGlobalAPI(Vue)

// 生成一个虚拟节点
const vm1 = new Vue({
  data: {
    name: 'aic'
  }
})
const render1 = compileToFunction('<h1 id="a">{{ name }}</h1>')
const oldVNode = render1.call(vm1)
const el1 = createElm(oldVNode)
document.body.append(el1)

// 再生成一个虚拟节点 patch
const vm2 = new Vue({
  data: {
    name: 'tom'
  }
})
const render2 = compileToFunction(
  '<h1 id="a" style="color:red;background:#0ff">{{ name }}</h1>'
)
const newVNode = render2.call(vm2)
// 比对两个虚拟节点的差异，更新需要更新的地方
setTimeout(() => {
  patch(oldVNode, newVNode)
}, 2000)

export default Vue
