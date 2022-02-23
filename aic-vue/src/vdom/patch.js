export function patch(el, vnode) {
  // 根据虚拟节点 渲染成真实节点
  const elm = createElm(vnode)
  const parentNode = el.parentNode
  parentNode.insertBefore(elm, el.nextSibling)
  parentNode.removeChild(el)
  // 删除老节点 根据 vnode 创建新节点 替换掉老节点
  return elm
}
// 面试问：虚拟节点的实现 虚拟节点 -> 真实节点
function createElm(vnode) {
  const { tag, data, children, text, vm } = vnode
  // 让虚拟节点和真实节点做一个映射，后续某个虚拟节点更新了 我们可以跟踪到真实节点，并且更新真实节点
  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag)
    updateProperties(vnode.el, data)
    children.forEach((child) => {
      vnode.el.appendChild(createElm(child))
    })
  } else {
    // 文本
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}

function updateProperties(el, props = {}) {
  for (let key in props) {
    el.setAttribute(key, props[key])
  }
}
