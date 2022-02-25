import { isObject } from '../utils'
import { arrayProto } from './array'
import { Dep } from './dep'

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

  const dep = new Dep()
  Object.defineProperty(obj, key, {
    get() {
      if (Dep.target) {
        dep.depend()
      }
      return value
    },
    set(newVal) {
      if (value !== newVal) {
        value = newVal

        dep.notify()
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
