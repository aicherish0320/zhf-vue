// 有个方法可以替代 new，方便传递参数

// 类只能描述实例 但是我们现在要描述类的本身
class Cat {
  name: string
  age: number
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
}

class Dog {
  constructor(public name: string, public age: number) {}
}
// ! typeof Cat 可以取出这个类的类型 在 ts 中 typeof 只能去取已有的类型的类型
// function createInstance(cla: typeof Cat, name: string, age: number) {
//   return new cla(name, age)
// }

// const cat = createInstance(Cat, 'tom', 13)
// ! new
// type CatCtor = new (name: string, age: number) => Cat

// function createInstance(cla: CatCtor, name: string, age: number) {
//   return new cla(name, age)
// }

// const cat = createInstance(Cat, 'tom', 13)

// ! interface
// interface ICatCtor {
//   new (name: string, age: number): Cat
// }

// function createInstance(cla: ICatCtor, name: string, age: number) {
//   return new cla(name, age)
// }

// const cat = createInstance(Cat, 'tom', 13)
// const dog = createInstance(Dog, 'jerry', 15)

// ! generics
// type CatCtor<T> = new (name: string, age: number) => T
// interface ICatCtor<T> {
//   new (name: string, age: number): T
// }
// function createInstance<T>(cla: ICatCtor<T>, name: string, age: number) {
//   return new cla(name, age)
// }

// const dog = createInstance<Dog>(Dog, 'jack', 23)

// * 我希望产生一个数组，给数组的长度和内容 -> 数组的结果
// function createArray<T>(times: number, item: T): T[] {
//   const result = []
//   for (let i = 0; i < times; i++) {
//     result.push(item)
//   }
//   return result
// }
// const arr1 = createArray(3, 'a')
// const arr2 = createArray(3, 1)

// // 泛型可以传入多个类型 两个泛型 元组的交换
// function swap<T, K>(tuple: [T, K]): [K, T] {
//   return [tuple[1], tuple[0]]
// }

// const ret = swap(['a', 1])
// // ret[0].toFixed(2)

// * 实现一个 forEach 方法，能进行数组的循环
// ** 普通函数
// function forEach<T>(arr: T[], cb: (arg: T) => void) {
//   for (let i = 0; i < arr.length; i++) {
//     cb(arr[i])
//   }
// }
// ** 箭头函数
// ! 在写类型时，如果泛型定义在函数的前面，表示的是执行的时候确定类型
// ! 如果放在 interface 或者 type 的后面，表示使用这个类型的时候就定义好了具体的类型
type ForEachType<T> = (arg: T, index: number) => void
// ! 泛型定义在外面，表示使用类型的时候确定类型；写在里面，表示在执行的时候确定类型
interface IForEachType<T> {
  (arg: T, index: number): void
}
const forEach = <T>(arr: T[], cb: IForEachType<T>): void => {
  for (let i = 0; i < arr.length; i++) {
    cb(arr[i], i)
  }
}
// ! error 推断不出类型
// <T> 放在函数前面 表示函数执行的时候传参
// type ForEachType = <T>(arg: T, index: number) => void
// const forEach = <T>(arr: T[], cb: ForEachType): void => {
//   for (let i = 0; i < arr.length; i++) {
//     cb<T>(arr[i], i)
//   }
// }

forEach([1, 2, 3], (item) => {
  console.log(item)
})
forEach(['a', 'b', 'c'], (item) => {
  console.log(item)
})
export {}
