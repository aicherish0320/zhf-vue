export const isObject = (val) => typeof val === 'object' && val !== null
export const isArray = (val) => Array.isArray(val)

let callbacks = []
let waiting = false

function flushCallbacks() {
  callbacks.forEach((cb) => cb())
  callbacks = []
  waiting = false
}

export const nextTick = (fn) => {
  callbacks.push(fn)
  if (!waiting) {
    return Promise.resolve().then(flushCallbacks)
    waiting = true
  }
}

const strategies = []
const lifecycle = ['beforeCreate', 'created', 'beforeMount', 'mounted']
lifecycle.forEach((hook) => {
  strategies[hook] = function (parentVal, childVal) {
    if (childVal) {
      if (parentVal) {
        return parentVal.concat(childVal)
      } else {
        return [childVal]
      }
    } else {
      parentVal
    }
  }
})
// {} { beforeCreate: fn } => { beforeCreate: [fn] } 
// { beforeCreate: [fn] }  { beforeCreate: fn } => { beforeCreate: [fn, fn] }
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
    const strategy = strategies[key]
    if (strategy) {
      options[key] = strategy(parentVal[key], childVal[key])
    } else {
      options[key] = childVal[key] || parentVal[key]
    }
  }

  return options
}
