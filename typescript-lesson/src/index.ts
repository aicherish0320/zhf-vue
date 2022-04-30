// ts typescript 就是给 js 语言添加 type 掌握 ts 中哪些类型，什么时候用写这个类型
// ts 具备类型推导的功能，自动会根据等号右边的值推导等号左边
// 如果在 ts 中不指定类型，则默认是 any 类型，可以被任何类型所赋值

// ts 中的基础类型
let str: string = 'aic'
let num: number = 23
let bool: boolean = true
// !元组
let tuple: [number, string] = [23, 'aicherish']
// 元组在通过方法添加数据时，只能添加已经存在的类型
tuple.push(12)
// tuple[4] = 'newItem' // error
// !数组
let arr: number[] = [1, 2, 3]
let arr2: (number | string)[] = [1, 2, 'str']
let arr4: Array<number | string> = [1, 'str']
// !枚举
enum AUTH {
  ADMIN = 1,
  MANAGER = 1 << 1,
  USER = 1 << 2
}
console.log(AUTH.ADMIN)

// 在 js 中，当我们调用方法的时候（存在装箱的概念）
// 如果默认调用基础类型上的方法，会有装箱的功能，就是把基础类型变成对象类型

// 写完的结果 默认添加 export {} 表示当前是一个模块
export {}
