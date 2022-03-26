import { generate } from './generate'
import { parseHTML } from './parseHtml'

export function compileToFunction(el) {
  const ast = parseHTML(el)
  const code = generate(ast)
  const render = new Function(`with(this){return ${code}}`)
  return render
}

