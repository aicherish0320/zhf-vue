import { generate } from './generate'
import { parseHTML } from './parseHtml'

export function compileToFunction(el) {
  const ast = parseHTML(el)
  console.log(ast)
  const code = generate(ast)
  console.log(code)
  const render = new Function(`with(${this}){return ${code}}`)
  console.log(render);
  return render
}

