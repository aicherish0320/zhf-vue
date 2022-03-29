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
    // 数组和对象都有
    this.dep = new Dep()
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

function dependArray(value) {
  for (let i = 0; i < value.length; i++) {
    const current = value[i];
    current.__ob__ && current.__ob__.dep.depend()
    if (Array.isArray(current)) {
      dependArray(current)
    }
  }
}

function defineReactive(obj, key, value) {
  const childOb = observe(value)

  const dep = new Dep()

  Object.defineProperty(obj, key, {
    get() {
      Dep.target && dep.depend()
      if(childOb) {
        childOb.dep.depend()
      }
      if(Array.isArray(value)) {
        dependArray(value)
      }
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
