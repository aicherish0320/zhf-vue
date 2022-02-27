import { isSameVNode } from '.'

export function patch(oldVNode, vNode) {
  const isRealElement = oldVNode.nodeType
  if (isRealElement) {
    // 根据虚拟节点 渲染成真实节点
    const elm = createElm(vNode)
    const parentNode = oldVNode.parentNode
    parentNode.insertBefore(elm, oldVNode.nextSibling)
    parentNode.removeChild(oldVNode)
    // 删除老节点 根据 vNode 创建新节点 替换掉老节点
    return elm
  } else {
    // diff: 同层比对，如果不一样，儿子就不用比对了，根据当前节点，创建儿子，全部替换
    // 如果新旧节点 不是同一个 删除老的换成新的
    if (!isSameVNode(oldVNode, vNode)) {
      return oldVNode.el.parentNode.replaceChild(createElm(vNode), oldVNode.el)
    }
    // 复用节点
    const el = (vNode.el = oldVNode.el)
    if (!oldVNode.tag) {
      // 文本 直接更新即可 一个是文本 另一个也是文本
      if (oldVNode.text !== vNode.text) {
        return (el.textContent = vNode.text)
      }
    }
    // 元素
    updateProperties(vNode, oldVNode.data)
    // 相同节点，复用节点，再更新不一样的地方
  }
}
// 面试问：虚拟节点的实现 虚拟节点 -> 真实节点
export function createElm(vNode) {
  const { tag, data, children, text, vm } = vNode
  // 让虚拟节点和真实节点做一个映射，后续某个虚拟节点更新了 我们可以跟踪到真实节点，并且更新真实节点
  if (typeof tag === 'string') {
    vNode.el = document.createElement(tag)
    updateProperties(vNode)
    children.forEach((child) => {
      vNode.el.appendChild(createElm(child))
    })
  } else {
    // 文本
    vNode.el = document.createTextNode(text)
  }
  return vNode.el
}

function updateProperties(vNode, oldProps = {}) {
  // 这里的逻辑可能是初次渲染，初次渲染 直接用 oldVNode给VNode的el赋值即可
  // 更新逻辑 拿到老的 props 和 VNode里面的 data 进行比对
  const el = vNode.el
  const newProps = vNode.data || {}
  const newStyle = newProps.style || {}
  const oldStyle = oldProps.style || {}
  for (const key in oldStyle) {
    // 老的样式有，新的没有，就把页面上的样式删除掉
    if (!newStyle[key]) {
      el.style[key] = ''
    }
  }
  // 新旧比对，两个对象如何对比差异
  for (const key in newProps) {
    // 直接用新的覆盖老的
    if (key === 'style') {
      for (const key in newStyle) {
        // { style: { color: red } }
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
