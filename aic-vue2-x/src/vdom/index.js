export function createElement(vm, tag, data = {}, ...children) {
  return VNode(vm, tag, data, children, data.key, undefined)
}
export function createText(vm, text) {
  return VNode(vm, undefined, undefined, undefined, undefined, text)
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
