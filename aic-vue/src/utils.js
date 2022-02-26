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

// {} { beforeCreate: fn } => { beforeCreate: [fn] }
// { beforeCreate: [fn] }  => { beforeCreate: [fn, fn] }
// 存放所有策略
const strats = {}
const lifecycle = ['beforeCreate', 'created', 'beforeMount', 'mounted']
lifecycle.forEach((hook) => {
  strats[hook] = function (parentVal, childVal) {
    if (childVal) {
      if (parentVal) {
        // 父子都有值 用父和子拼在一起 父有值一定是数组
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
  let options = {}
  for (const key in parentVal) {
    mergeField(key)
  }

  for (const key in childVal) {
    if (!parentVal.hasOwnProperty(key)) {
      mergeField(key)
    }
  }
  function mergeField(key) {
    // 策略模式
    const strat = strats[key]
    if (strat) {
      options[key] = strat(parentVal[key], childVal[key])
    } else {
      options[key] = childVal[key] || parentVal[key]
    }
  }
  return options
}
