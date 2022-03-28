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
// 存放策略
let strats = {}
let lifecycle = ['beforeCreate', 'created', 'beforeMount', 'mounted']
lifecycle.forEach((hook) => {
  strats[hook] = function (parentVal, childVal) {
    if (childVal) {
      if (parentVal) {
        return parentVal.concat(childVal)
      } else {
        return [childVal]
      }
    } else {
      return parentVal
    }
  }
})

export function mergeOptions(parentVal, childVal) {
  const options = {}
  for (const key in parentVal) {
    mergeField(key)
  }
  for (const key in childVal) {
    if (!parentVal.hasOwnProperty(key)) {
      mergeField(key)
    }
  }

  function mergeField(key) {
    let start = strats[key]
    if (start) {
      options[key] = start(parentVal[key], childVal[key])
    } else {
      options[key] = childVal[key] || parentVal[key]
    }
  }

  return options
}
