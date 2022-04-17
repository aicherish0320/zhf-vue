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

    //! 比较子节点
    const oldChildren = oldVNode.children || []
    const newChildren = vNode.children || []
    // 情况一：老的有儿子 新的没儿子
    if (oldChildren.length > 0 && newChildren.length === 0) {
      el.innerHTML = ''
      // 情况二：新的有儿子 老的没儿子
    } else if (newChildren.length > 0 && oldChildren.length === 0) {
      newChildren.forEach((child) => el.appendChild(createElm(child)))
    } else {
      // 情况三：新老都有儿子
      updateChildren(el, oldChildren, newChildren)
    }
  }

  return el
}

function updateChildren(el, oldChildren, newChildren) {
  // vue2 中如何做的 diff 算法
  // vue 内部做优化（能尽量提升性能，实在不行，再暴力比对）
  // 在列表中新增和删除

  let oldStartIndex = 0
  let oldStartVNode = oldChildren[0]
  let oldEndIndex = oldChildren.length - 1
  let oldEndVNode = oldChildren[oldEndIndex]

  let newStartIndex = 0
  let newStartVNode = newChildren[0]
  let newEndIndex = newChildren.length - 1
  let newEndVNode = newChildren[newEndIndex]

  function makeKeyByIndex(children) {
    const map = {}

    children.forEach((item, index) => {
      map[item.key] = index
    })

    return map
  }
  const mapping = makeKeyByIndex(oldChildren)

  // diff 算法的复杂度是 O(n)
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (!oldStartVNode) {
      oldStartVNode = oldChildren[++oldStartIndex]
    } else if (!oldEndVNode) {
      oldEndVNode = oldChildren[--oldEndIndex]
    }
    // 老的开始 新的开始
    else if (isSameVNode(oldStartVNode, newStartVNode)) {
      patch(oldStartVNode, newStartVNode) // 会递归比较子节点

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
      // 之前的逻辑都是考虑 用户一些特殊情况 但是有非特殊的 乱序排

      let moveIndex = mapping[newStartVNode.key]
      if (moveIndex == undefined) {
        // 没有直接将节点插入到开头的前面
        el.insertBefore(createElm(newStartVNode), oldStartVNode.el)
      } else {
        //
        const moveVNode = oldChildren[moveIndex]
        el.insertBefore(moveVNode.el, oldStartVNode.el)
        patch(moveVNode, newStartVNode)
        // 将移动的节点标记为空
        oldChildren[moveIndex] = undefined
      }

      newStartVNode = newChildren[++newStartIndex]
    }
  }
  // 说明老的比完了
  if (newStartIndex <= newEndIndex) {
    // 看一下当前尾结点的下一个元素是否存在，如果存在则插入到它前面
    // 如果下一个是 null，就是 appendChild
    const anchor =
      newChildren[newEndIndex + 1] == null
        ? null
        : newChildren[newEndIndex + 1].el
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      el.insertBefore(createElm(newChildren[i]), anchor)
    }
  }
  // 说明新的比完了
  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      const child = oldChildren[i]
      // child 可能为 undefined
      child && el.removeChild(child.el)
    }
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
