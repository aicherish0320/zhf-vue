/**
 * @description Vue mergeOptions
 */

const parentVal = {
  beforeCreate() {
    console.log('parent beforeCreate')
  }
}

const childVal = {
  beforeCreate() {
    console.log('child beforeCreate')
  }
}

const strategies = {}
const lifecycle = ['beforeCreate', 'created']
lifecycle.forEach(hook => {
  strategies[hook] = function(parentVal, childVal) {
    if(childVal) {
      if(parentVal) {
        return parentVal.concat(childVal)
      } else {
        return [childVal]
      }
    } else {
      return parentVal
    }
  }
})

function mergeOptions(parentVal, childVal) {
  const options = {}

  for (const key in parentVal) {
    mergeField(key)
  }

  for (const key in childVal) {
    if(!parentVal.hasOwnProperty(key)) {
      mergeField(key)
    }
  }


  function mergeField(key) {
    const strategy = strategies[key]
    if(strategy) {
      options[key] = strategy(parentVal[key], childVal[key])
    } else {
      options[key] = childVal[key] || parentVal[key]
    }
  }

  return options
}
