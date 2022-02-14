import { isObject } from '../utils'

class Observer {
  constructor(value) {
    this.walk(value)
  }

  walk(data) {
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key])
    })
  }
}
/*
  性能优化的原则
    1. 不要把所有的数据都放在 data 中
    2. 不要写数据的时候，层次过深；尽量扁平化数据
    3. 不要频繁获取数据
    4. 数据不需要响应式，可以使用 Object.freeze 冻结属性
*/
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

export function observe(value) {
  if (!isObject(value)) {
    return
  }

  return new Observer(value)
}
