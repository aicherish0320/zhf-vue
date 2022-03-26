export function patch(el, vnode) {
  const elm = createElm(vnode)
  const parentNode = el.parentNode
  parentNode.insertBefore(elm, el.nextSibling)
  parentNode.removeChild(el)
  return elm
}

function createElm(vnode) {
  const { vm, tag, data, children, text } = vnode
  console.log(data);
  if (typeof vnode.tag === 'string') {
    const el = (vnode.el = document.createElement(tag))


    updateProperties(vnode.el, data)

    children.forEach((child) => {
      el.appendChild(createElm(child))
    })
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}

function updateProperties(el, props={}) {
  for (const key in props) {
    el.setAttribute(key, props[key])
  }
}
