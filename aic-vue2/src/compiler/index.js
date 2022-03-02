import { generate } from './generate'
import { parseHTML } from './parseHTML'

export function compileToFunction(el) {
  // template -> ast -> render
  const ast = parseHTML(el)
  const code = generate(ast)
  const render = new Function(`with(this){ return ${code} }`)
  return render
}
