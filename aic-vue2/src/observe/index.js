import { isObject } from '../utils'
import { arrayProto } from './array'

class Observer {
  constructor(data) {
    if (Array.isArray(data)) {
      Object.defineProperty(data, '__ob__', {
        enumerable: false,
        value: this
      })
      data.__proto__ = arrayProto
      this.observeArray(data)
    } else {
      this.walk(data)
    }
  }
  walk(data) {
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key])
    })
  }
  observeArray(data) {
    data.forEach((item) => {
      observe(item)
    })
  }
}

function defineReactive(obj, key, value) {
  observe(value)
  Object.defineProperty(obj, key, {
    get() {
      return value
    },
    set(newVal) {
      if (value !== newVal) {
        value = newVal
      }
    }
  })
}

export function observe(data) {
  if (!isObject(data)) {
    return
  }
  new Observer(data)
}
