export function createElement(vm, tag, data = {}, ...children) {
  return vNode(vm, tag, data, children, data.key, undefined)
}
export function createText(vm, text) {
  return vNode(vm, undefined, undefined, undefined, undefined, text)
}

function vNode(vm, tag, data, children, key, text) {
  return { vm, tag, data, children, key, text }
}
