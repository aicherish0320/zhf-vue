// 函数 我们一般也会标识类型 函数的参数和返回值
// 1. function 声明 2. 表达式声明

type Sum = (a: string, b: string) => string
const sum: Sum = (a, b) => a + b

// 函数的参数 可选参数、默认值、剩余运算符
function optional(a: string, c: number = 100, b?: string) {
  return c
}

// 标识函数类型中的 this 类型
function callThis(this: string) {
  // this
}
callThis.call('abc')

// 函数的重载
// 'abc' -> ['a', 'b', 'c']
// 123  -> [1, 2, 3]

function toArray(arg: string): string[]
function toArray(arg: number): number[]
function toArray(arg: number | string): number[] | string[] {
  if (typeof arg === 'string') {
    return arg.split('')
  } else {
    return arg
      .toString()
      .split('')
      .map((i) => Number(i))
  }
}

const arr = toArray(123)
const strArr = toArray('123')

// function toArray2<T>(arg: T): T[] {
//   if (typeof arg === 'string') {
//     return arg.split('')
//   } else {
//     return arg
//       .toString()
//       .split('')
//       .map((i) => Number(i))
//   }
// }

export {}
