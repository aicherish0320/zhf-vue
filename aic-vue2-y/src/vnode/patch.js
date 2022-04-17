import { isSameVNode } from './index'

export function patch(oldVNode, vNode) {
  const isRealElement = oldVNode.nodeType
  // 初始挂载
  if (isRealElement) {
    const elm = createElm(vNode)
    const parentNode = oldVNode.parentNode
    parentNode.insertBefore(elm, oldVNode.nextSibling)
    parentNode.removeChild(oldVNode)
    return elm
  } else {
    // patch 流程
    // ! 不是相同节点，删除老节点，换成新节点
    if (!isSameVNode(vNode, oldVNode)) {
      return oldVNode.el.parentNode.replaceChild(createElm(vNode), oldVNode.el)
    }
    // TODO 文本直接更新即可
    const el = (vNode.el = oldVNode.el)
    if (!oldVNode.tag) {
      if (oldVNode.text !== vNode.text) {
        return (el.textContent = vNode.text)
      }
    }
    // ! 元素 更新属性
    updateProperties(vNode, oldVNode.data)

    // ! 比较子节点
    const oldChildren = oldVNode.children || []
    const newChildren = vNode.children || []
    // ! 情况一：老的有儿子 新的没有儿子
    if (oldChildren.length > 0 && newChildren.length === 0) {
      el.innerHTML = ''
      // ! 情况二：老的无儿子 新的有儿子
    } else if (oldChildren.length === 0 && newChildren.length > 0) {
      newChildren.forEach((child) => {
        el.appendChild(createElm(child))
      })
    } else {
      // ! 情况三：新老都有儿子
      updateChildren(el, oldChildren, newChildren)
    }
  }
}

function makeKeyByIndex(oldChildren) {
  const map = {}
  oldChildren.forEach((item, index) => {
    map[item.key] = index
  })
  return map
}

function updateChildren(el, oldChildren, newChildren) {
  let oldStartIndex = 0
  let oldStartVNode = oldChildren[0]
  let oldEndIndex = oldChildren.length - 1
  let oldEndVNode = oldChildren[oldEndIndex]

  let newStartIndex = 0
  let newStartVNode = newChildren[0]
  let newEndIndex = newChildren.length - 1
  let newEndVNode = newChildren[newEndIndex]

  const mapping = makeKeyByIndex(oldChildren)

  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (!oldStartVNode) {
      oldStartVNode = oldChildren[++oldStartIndex]
    } else if (!oldEndVNode) {
      oldEndVNode = oldChildren[--oldEndIndex]
    }
    // 老的开始 新的开始
    else if (isSameVNode(oldStartVNode, newStartVNode)) {
      patch(oldStartVNode, newStartVNode)

      oldStartVNode = oldChildren[++oldStartIndex]
      newStartVNode = newChildren[++newStartIndex]
      // 老的结束 新的结束
    } else if (isSameVNode(oldEndVNode, newEndVNode)) {
      patch(oldEndVNode, newEndVNode)

      oldEndVNode = oldChildren[--oldEndIndex]
      newEndVNode = newChildren[--newEndIndex]
      // 老的开始 新的结束
    } else if (isSameVNode(oldStartVNode, newEndVNode)) {
      patch(oldStartVNode, newEndVNode)

      el.insertBefore(oldStartVNode.el, oldEndVNode.el.nextSibling)

      oldStartVNode = oldChildren[++oldStartIndex]
      newEndVNode = newChildren[--newEndIndex]
      // 老的结束 新的开始
    } else if (isSameVNode(oldEndVNode, newStartVNode)) {
      patch(oldEndVNode, newStartVNode)

      el.insertBefore(oldEndVNode.el, oldStartVNode.el)

      oldEndVNode = oldChildren[--oldEndIndex]
      newStartVNode = newChildren[++newStartIndex]
    } else {
      const moveIndex = mapping[newStartVNode.key]
      if (moveIndex === undefined) {
        el.insertBefore(createElm(newStartVNode), oldStartVNode.el)
      } else {
        const moveVNode = oldChildren[moveIndex]
        el.insertBefore(moveVNode.el, oldStartVNode.el)
        patch(moveVNode, newStartVNode)

        oldChildren[moveIndex] = undefined
      }

      newStartVNode = newChildren[++newStartIndex]
    }
  }
  // 新的多
  if (newEndIndex >= newStartIndex) {
    const anchor = newChildren[newEndIndex + 1]
      ? newChildren[newEndIndex + 1].el
      : null
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      el.insertBefore(createElm(newChildren[i]), anchor)
    }
  }
  // 老的多
  if (oldEndIndex >= oldStartIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      const child = oldChildren[i]
      child && el.removeChild(child.el)
    }
  }
}

export function createElm(vnode) {
  const { vm, tag, data, children, text } = vnode
  if (typeof vnode.tag === 'string') {
    const el = (vnode.el = document.createElement(tag))

    updateProperties(vnode, data)

    children.forEach((child) => {
      el.appendChild(createElm(child))
    })
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}

function updateProperties(vNode, oldProps = {}) {
  const el = vNode.el
  const newProps = vNode.data || {}

  const oldStyle = oldProps.style || {}
  const newStyle = newProps.style || {}

  for (const key in oldStyle) {
    if (!newStyle[key]) {
      el.style[key] = ''
    }
  }

  for (const key in newProps) {
    if (key === 'style') {
      for (const key in newStyle) {
        el.style[key] = newStyle[key]
      }
    } else {
      el.setAttribute(key, newProps[key])
    }
  }

  for (const key in oldProps) {
    if (!newProps[key]) {
      el.removeAttribute(key)
    }
  }
}
