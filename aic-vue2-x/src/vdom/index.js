export function createElement(vm, tag, data = {}, ...children) {
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

function VNode(vm, tag, data, children, key, text) {
  return {
    vm,
    tag,
    data,
    children,
    key,
    text
  }
}
