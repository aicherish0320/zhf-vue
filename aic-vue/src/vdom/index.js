// 返回虚拟节点
export function createElement(vm, tag, data = {}, ...children) {
  return vnode(vm, tag, data, children, data.key, undefined)
}
export function createText(vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text)
}
// 看两个节点是不是相同节点 判断 tag 和 Key
// Vue2 性能问题 递归比对
export function isSameVNode(newVNode, oldVNode) {
  return newVNode.tag === oldVNode.tag && newVNode.key === oldVNode.key
}

function vnode(vm, tag, data, children, key, text) {
  return {
    vm,
    tag,
    data,
    children,
    key,
    text
  }
}
