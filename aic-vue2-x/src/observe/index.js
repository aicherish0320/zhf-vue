import { arrayPrototype } from '../array'
import { isArray, isObject } from '../utils'

export function observe(value) {
  if (!isObject(value)) {
    return
  }

  // 需要对 对象进行观测
  // 如果一个数据已经被观测过了，就不要在进行观测了，用类来实现，观测过，就增加一个标识，
  // 再观测，可以先检测是否观测过，如果观测过了就跳过

  return new Observer(value)
}

class Observer {
  constructor(value) {
    Object.defineProperty(value, '__ob__', {
      enumerable: false,
      value: this
    })
    if (isArray(value)) {
      // 更改数组原型方法，如果是数组 就去改写数组的原型链
      value.__proto__ = arrayPrototype

      this.observerArray(value)
    } else {
      // 循环遍历对象，进行响应式观测
      this.walk(value)
    }
  }
  // 递归遍历数组，对数组内部的对象再次重写 [[]] [{}]
  observerArray(data) {
    // vm.arr[0].a = 100 -> 会触发视图更新
    // vm.arr[0] = 100 -> 不会触发视图更新
    // 数组里面如果是引用类型 那么是响应式的
    data.forEach((item) => observe(item))
  }
  walk(data) {
    Object.keys(data).forEach((key) => {
      // 使用 defineProperty 重新定义
      defineReactive(data, key, data[key])
    })
  }
}

/*
  性能优化的原则
  1. 不要把所有的数据都放在 data 中，因为所有的数据都会增加 get 和 set
  2. 不要写数据的时候，层次过深，尽量扁平化数据
  3. 不要频繁的获取数据
  4. 如果数据不需要响应式，可以使用 Object.freeze 冻结属性
*/

// Vue2 性能瓶颈的原因就在此
// Object.defineProperty 性能低，而且还需要循环递归遍历去定义getter/setter
function defineReactive(obj, key, value) {
  observe(value)
  Object.defineProperty(obj, key, {
    get() {
      console.log('获取 >>> ', key)

      return value
    },
    set(newVal) {
      if (newVal === value) {
        return
      }
      console.log('更新 >>> ', key)
      value = newVal

      observe(newVal)
    }
  })
}
