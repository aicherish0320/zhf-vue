import { generate } from './generate'
import { parserHTML } from './parseHTML'

export function compileToFunction(template) {
  // 1. 将模板变成 ast 语法树
  const ast = parserHTML(template)
  // TODO 代码优化，标记静态节点
  // 2. 代码生成
  const code = generate(ast)
  const render = new Function(`with(this){ return ${code} }`)
  return render
}


