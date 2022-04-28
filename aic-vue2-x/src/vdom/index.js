import { isObject, isReservedTag } from '../utils'

function createComponent(vm, tag, data, children, key, Ctor) {
  if (isObject(Ctor)) {
    // 组件的定义一定是通过 Vue.extends 进行包裹的
    Ctor = vm.$options._base.extend(Ctor)
  }
  data.hook = {
    // 组件的生命周期
    init() {},
    prePatch() {},
    postPatch() {}
  }
  // componentOptions 存放一个 重要属性 Ctor
  const componentVNode = VNode(vm, tag, data, undefined, key, undefined, {
    Ctor,
    children,
    tag
  })
  return componentVNode
}

export function createElement(vm, tag, data = {}, ...children) {
  // 如何区分是组件还是元素节点
  if (!isReservedTag(tag)) {
    // 组件的初始化，就是 new 组件的 构造函数
    const Ctor = vm.$options.components[tag]
    return createComponent(vm, tag, data, children, data.key, Ctor)
  }

  return VNode(vm, tag, data, children, data.key, undefined)
}
export function createText(vm, text) {
  return VNode(vm, undefined, undefined, undefined, undefined, text)
}
// 判断是不是相同的VNode，判断 tag 和 key
// vue2 性能问题，递归比对
export function isSameVNode(newVNode, oldVNode) {
  return newVNode.tag === oldVNode.tag && newVNode.key === oldVNode.key
}

function VNode(vm, tag, data, children, key, text, options) {
  return {
    vm,
    tag,
    data,
    children,
    key,
    text,
    componentOptions: options
  }
}
