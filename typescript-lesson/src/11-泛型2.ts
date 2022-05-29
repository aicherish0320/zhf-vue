// 泛型无法做运算

// 可以限制泛型的范围 泛型约束
function sum<T extends string>(a: T, b: T): T {
  return (a + b) as T
}
// 重载
function add(a: number, b: number): number
function add(a: string, b: string): string
function add(a: number | string, b: number | string) {
  if (typeof a === 'number' && typeof b === 'number') {
    return a + b
  } else if (typeof a === 'string' && typeof b === 'string') {
    return a + b
  }
}

const ret1 = add(1, 2)
const ret2 = add('a', 'b')

export {}
