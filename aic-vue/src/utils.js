export function isFunction(data) {
  return typeof data === 'function'
}

export function isObject(val) {
  return typeof val === 'object' && val !== null
}

export function isArray(val) {
  return Array.isArray(val)
}

let callbacks = []
let waiting = false

function flushCallbacks() {
  callbacks.forEach((fn) => fn())
  callbacks = []
  waiting = false
}

export function nextTick(fn) {
  // Vue3里面的nextTick 就是 promise ,Vue2里面做了一些兼容处理
  callbacks.push(fn)
  if (!waiting) {
    Promise.resolve().then(flushCallbacks)
    waiting = true
  }
}
