import { parserHTML } from './parseHTML'

export function compileToFunction(template) {
  // 1. 将模板变成 ast 语法树
  const ast = parserHTML(template)
  console.log(ast)
}
