export const isObject = (val) => typeof val === 'object' && val !== null
export const isArray = (val) => Array.isArray(val)

let callbacks = []
let waiting = false

function flushCallbacks() {
  callbacks.forEach(cb => cb())
  callbacks = []
  waiting = false
}

export const nextTick = (fn) => {
  callbacks.push(fn)
  if(!waiting) {
    return Promise.resolve().then(flushCallbacks)
    waiting = true
  }
}

