export function patch(el, vNode) {
  const elm = createElm(vNode)

  const parentNode = el.parentNode
  // el.nextSibling 不存在就是 null，如果为 null，insertBefore 相当于 appendChild
  parentNode.insertBefore(elm, el.nextSibling)
  parentNode.removeChild(el)
}

function createElm(vNode) {
  const { tag, data, children, text, vm } = vNode

  // 我们让真实节点和虚拟节点做一个映射关系
  // 后续某个虚拟节点更新了 我们可以跟踪到真实节点，并且更新真实节点
  if (typeof tag === 'string') {
    const el = (vNode.el = document.createElement(tag))

    updateProperties(vNode.el, data)

    children.forEach((child) => {
      el.appendChild(createElm(child))
    })
  } else {
    vNode.el = document.createTextNode(text)
  }
  return vNode.el
}

function updateProperties(el, props = {}) {
  for (const key in props) {
    el.setAttribute(key, props[key])
  }
}
