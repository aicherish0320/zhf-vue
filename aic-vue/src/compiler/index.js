import { parseHTML } from './parser'

export function compileToFunction(template) {
  // 1. 将模板编程 ast 语法树
  const ast = parseHTML(template)
  console.log('ast >>> ', ast)
}
