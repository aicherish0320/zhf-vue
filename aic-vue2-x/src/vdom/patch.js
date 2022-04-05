import { isSameVNode } from './index'

export function patch(oldVNode, vNode) {
  const isRealElement = oldVNode.nodeType

  if (isRealElement) {
    const elm = createElm(vNode)

    const parentNode = oldVNode.parentNode
    // oldVNode.nextSibling 不存在就是 null，如果为 null，insertBefore 相当于 appendChild
    parentNode.insertBefore(elm, oldVNode.nextSibling)
    parentNode.removeChild(oldVNode)

    return elm
  } else {
    // 不是相同节点，删除老节点，换成新节点
    if (!isSameVNode(oldVNode, vNode)) {
      return oldVNode.el.parentNode.replaceChild(createElm(vNode), oldVNode.el)
    }
    // 文本直接更新即可
    const el = (vNode.el = oldVNode.el)
    if (!oldVNode.tag) {
      if (oldVNode.text !== vNode.text) {
        return (el.textContent = vNode.text)
      }
    }

    // 元素 更新属性
    updateProperties(vNode, oldVNode.data)
    // 是相同节点，复用节点，再更新不一样的地方（属性）
  }
}

export function createElm(vNode) {
  const { tag, data, children, text, vm } = vNode

  // 我们让真实节点和虚拟节点做一个映射关系
  // 后续某个虚拟节点更新了 我们可以跟踪到真实节点，并且更新真实节点
  if (typeof tag === 'string') {
    const el = (vNode.el = document.createElement(tag))

    updateProperties(vNode)

    children.forEach((child) => {
      el.appendChild(createElm(child))
    })
  } else {
    vNode.el = document.createTextNode(text)
  }
  return vNode.el
}

function updateProperties(vNode, oldProps = {}) {
  // 这里的逻辑可能是初次渲染，初次渲染 直接用 oldProps 给 vNode 的 el 赋值即可
  // 更新逻辑 拿到老的 props 和 vNode 里面的 data 进行比对
  const el = vNode.el
  const newProps = vNode.data || {}

  // style
  const newStyle = newProps.style || {}
  const oldStyle = oldProps.style || {}
  
  // 老的有 新的没有 就把页面上的样式删除
  for (const key in oldStyle) {
    if (!newStyle[key]) {
      el.style[key] = ''
    }
  }

  // 新旧比对 两个对象如何比对差异？
  
  // 直接用新的改掉老的就可以了
  for (const key in newProps) {
    if (key === 'style') {
      for (const key in newStyle) {
        el.style[key] = newStyle[key]
      }
    } else {
      el.setAttribute(key, newProps[key])
    }
  }
  // 老的有 新的没有
  for (const key in oldProps) {
    if (!newProps[key]) {
      el.removeAttribute(key)
    }
  }
}
