//! null undefined
// ts 中 null 和 undefined 可以赋值给任何类型（任何类型的子类型）
// 严格模式中不能将 null 和 undefined 赋值给给任何类型
// nuLl -> null undefined -> undefined

// const num: number = null
const un: undefined = undefined
const nu: null = null
// ! void 空类型 一般用于函数的返回值类型
function fn1(): void {}
function fn2(): void {
  return undefined
}
// function fn3(): void {
//   // 严格模式下 不行
//   return null
// }

//! never 标识永远不
// 1. 程序无法到终点，死循环，抛错；2. 判断的时候，出现 never；3. 用 never 来做一些特殊的处理
function fn3(): never {
  throw new Error()
}
function fn4(): never {
  while (true) {}
}

// ! Symbol bigInt

// ! object
// ! any

const s1 = Symbol()

export {}
