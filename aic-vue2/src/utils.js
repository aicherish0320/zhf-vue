export const isFunction = (v) => typeof v === 'function'
export const isObject = (v) => typeof v === 'object' && v !== null

const strategies = {}
const lifecycle = ['beforeCreate', 'created', 'beforeMount', 'mounted']
lifecycle.forEach((hook) => {
  strategies[hook] = function (parentVal, childVal) {
    if (childVal) {
      if (parentVal) {
        return parentVal.concat(childVal)
      } else {
        if (Array.isArray(childVal)) {
          return childVal
        } else {
          return [childVal]
        }
      }
    } else {
      return parentVal
    }
  }
})

export const mergeOptions = (parentVal, childVal) => {
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
