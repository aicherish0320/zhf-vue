import { arrayProto } from '../array/index'
import { isArray, isObject } from '../utils/index'
import Dep from './dep'

export function observe(data) {
  if (!isObject(data)) {
    return
  }

  if (data.__ob__) {
    return
  }

  return new Observer(data)
}

class Observer {
  constructor(data) {
    Object.defineProperty(data, '__ob__', {
      enumerable: false,
      value: this
    })
    if (isArray(data)) {
      data.__proto__ = arrayProto

      this.observeArray(data)
    } else {
      this.walk(data)
    }
  }
  observeArray(data) {
    data.forEach((item) => observe(item))
  }
  walk(data) {
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key])
    })
  }
}

function defineReactive(obj, key, value) {
  const dep = new Dep()

  observe(value)

  Object.defineProperty(obj, key, {
    get() {
      Dep.target && dep.depend()
      return value
    },
    set(newVal) {
      if (newVal === value) {
        return
      }
      observe(newVal)
      value = newVal
      dep.notify()
    }
  })
}
