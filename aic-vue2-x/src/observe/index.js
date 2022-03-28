import { arrayPrototype } from '../array'
import { isArray, isObject } from '../utils'
import Dep from './dep'

export function observe(value) {
  if (!isObject(value)) {
    return
  }
  // 已经被观测过
  if (value.__ob__) {
    return
  }

  // 需要对 对象进行观测
  // 如果一个数据已经被观测过了，就不要在进行观测了，用类来实现，观测过，就增加一个标识，
  // 再观测，可以先检测是否观测过，如果观测过了就跳过

  return new Observer(value)
}

class Observer {
  constructor(value) {
    // 对象和数组都会有
    // 对象表面看是重复定义了，但是，如果给对象和数组添加一个自定义属性，我希望也能更新视图
    // {}.__ob__.dep => watcher 对象本身 （$set原理）
    this.dep = new Dep()
    Object.defineProperty(value, '__ob__', {
      enumerable: false,
      value: this
    })
    if (isArray(value)) {
      // 更改数组原型方法，如果是数组 就去改写数组的原型链
      value.__proto__ = arrayPrototype

      this.observerArray(value)

      // 数组，收集数组的依赖，给每个数组添加一个 dep
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
// 让数组里的引用类型都收集依赖
function dependArray(value) {
  for (let i = 0; i < value.length; i++) {
    const current = value[i]
    current.__ob__ && current.__ob__.dep.depend()

    if (Array.isArray(current)) {
      dependArray(current)
    }
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
  let childOb = observe(value)
  // 数组的 dep
  const dep = new Dep()

  Object.defineProperty(obj, key, {
    get() {
      if (Dep.target) {
        dep.depend()
      }

      if (childOb) {
        // 取属性的时候 会对对应的值(对象本身和数组)进行依赖收集
        childOb.dep.depend()

        if (Array.isArray(value)) {
          // 可能是数组套数组
          dependArray(value)
        }
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

// 1. 默认 Vue 在初始化的时候，会对对象每一个属性都进行劫持，增加 dep 属性，当取值的时候会做依赖收集
// 2. 默认还会对属性值是（对象和数组的本身进行增加 dep 属性） 进行依赖收集
// 3. 如果是属性变化，触发属性对应的 dep 去更新
// 4. 如果是数组更新，触发数组本身的 dep 进行更新
// 5. 如果取值的时候是数组还要让数组中的对象类型也进行依赖收集（递归依赖收集）
// 6. 如果数组里面放对象，默认对象里的属性是会进行依赖搜集的，因为在取值时，会进行JSON.stringify操作
