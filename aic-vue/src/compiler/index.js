import { generate } from './generate'
import { parseHTML } from './parser'

export function compileToFunction(template) {
  // 1. 将模板编程 ast 语法树
  const ast = parseHTML(template)
  console.log('ast >>> ', ast)
  // 2. 代码优化 编辑静态节点
  // 3. 代码生成
  const code = generate(ast)
  // 模板引擎的实现原理都是 new Function + with
  const render = new Function(`with(this){return ${code}}`)
  return render
}
