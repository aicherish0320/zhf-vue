import { isArray, isObject } from '../utils'
import { arrayMethods } from './array'
import Dep from './dep'

class Observer {
  constructor(value) {
    // 给对象和数组添加一个自定义属性
    Object.defineProperty(value, '__ob__', {
      enumerable: false,
      value: this
    })
    if (isArray(value)) {
      // 更改数组原型方法
      value.__proto__ = arrayMethods
      this.observeArray(value)
    } else {
      // 核心就是循环对象
      this.walk(value)
    }
  }
  // 递归遍历数组，对数组内部的对象再次重写
  observeArray(data) {
    // 数组里面如果是引用类型那么是响应式的
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
    1. 不要把所有的数据都放在 data 中
    2. 不要写数据的时候，层次过深；尽量扁平化数据
    3. 不要频繁获取数据
    4. 数据不需要响应式，可以使用 Object.freeze 冻结属性
*/
function defineReactive(obj, key, value) {
  observe(value)
  // 每个属性对应一个 dep
  const dep = new Dep()

  Object.defineProperty(obj, key, {
    get() {
      if (Dep.target) {
        dep.depend()
      }
      // console.log('get >>> ', key, value)
      // 闭包，value 会向上层查找
      return value
    },
    set(newVal) {
      if (value !== newVal) {
        // console.log('set >>> ', key, newVal)
        observe(newVal)
        value = newVal
        // 拿到当前的 dep 里面的 watcher 依次执行
        dep.notify()
      }
    }
  })
}

export function observe(value) {
  // 如果 value 不是对象，那么就不用观察了
  if (!isObject(value)) {
    return
  }

  // 一个对象不需要重新被观测
  if (value.__ob__) {
    return
  }

  // 需要对对象进行观测 （最外层必须是一个 {}， 不能是数组）
  // 如果一个数据已经被观测过了，就不要再进行观测了，用类来实现，观测过了就增加一个标识
  // 在观测的时候，可以先检测是否观测过了，如果观测过了就跳过检测
  return new Observer(value)
}
