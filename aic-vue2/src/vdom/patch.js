export function patch(el, vnode) {
  const elm = createElm(vnode)

  const parentNode = el.parentNode
  parentNode.insertBefore(elm, el.nextSibling)
  parentNode.removeChild(el)

  return elm
}

function createElm(vnode) {
  const { tag, data, children, text, vm } = vnode
  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag)
    children.forEach((child) => {
      vnode.el.appendChild(createElm(child))
    })
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}
