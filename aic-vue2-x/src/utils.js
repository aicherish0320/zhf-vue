export function isFunc(val) {
  return typeof val === 'function'
}

export function isObject(val) {
  return typeof val === 'object' && val !== null
}

export function isArray(val) {
  return Array.isArray(val)
}
// Vue3 里面的 nextTick 就是 promise，Vue2 里面做了一些兼容处理
// 先缓存 目的是为了只更新一次
let callbacks = []
let waiting = false
function flushCallbacks() {
  callbacks.forEach((cb) => cb())
  callbacks = []
  waiting = false
}
export function nextTick(fn) {
  // 1.
  // Promise.resolve().then(fn)
  // 2. 
  callbacks.push(fn)
  if (!waiting) {
    return Promise.resolve().then(flushCallbacks)
    waiting = true
  }
}
