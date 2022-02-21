export function parseHTML(html) {
  // 正则
  const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*` // 匹配标签名
  const qnameCapture = `((?:${ncname}\\:)?${ncname})`
  const startTagOpen = new RegExp(`^<${qnameCapture}`) // 匹配标签名
  const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) // 匹配标签结束 </aa>
  const attribute =
    /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ // 匹配属性
  const startTagClose = /^\s*(\/?)>/ // 匹配结束标签 > />
  const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
  // 构建父子关系
  let stack = []
  let root = null

  function createASTElement(tag, attrs, parent = null) {
    return {
      tag,
      type: 1,
      children: [],
      parent,
      attrs
    }
  }
  function start(tag, attrs) {
    // 遇到开始标签，就取栈中的最后一个 作为父级
    const parent = stack[stack.length - 1]
    let element = createASTElement(tag, attrs, parent)
    // 说明当前节点就是根节点
    if (root === null) {
      root = element
    }
    if (parent) {
      // 更新父级节点
      element.parent = parent
      parent.children.push(element)
    }

    stack.push(element)
  }
  function end(tag) {
    const endTag = stack.pop()
    if (endTag.tag !== tag) {
      console.log('标签出错了')
    }
  }
  function text(chars) {
    const parent = stack[stack.length - 1]
    chars.replace(/\s/g, '')
    if (chars) {
      parent.children.push({
        type: 2,
        text: chars
      })
    }
  }

  function advance(len) {
    html = html.substring(len)
  }

  function parseStartTag() {
    const startMatch = html.match(startTagOpen)
    if (startMatch) {
      const match = {
        tagName: startMatch[1],
        attrs: []
      }
      advance(startMatch[0].length)
      // 匹配属性 1. 要有属性，2.不能为开始的结束标签
      let end, attr
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        })
        advance(attr[0].length)
      }
      if (end) {
        advance(end[0].length)
      }
      return match
    }
    return false
  }

  // 不停的截取模板，直到把模板全部解析完毕
  while (html) {
    // 解析 标签和文本
    let index = html.indexOf('<')
    if (index === 0) {
      // 标签 解析开始标签 并且把属性也解析出来
      const startTagMatch = parseStartTag()

      if (startTagMatch) {
        // 开始标签
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }
      let endTagMatch
      if ((endTagMatch = html.match(endTag))) {
        // 结束标签
        end(endTagMatch[1])
        advance(endTagMatch[0].length)
        continue
      }

      break
    }
    // 文本
    if (index > 0) {
      let chars = html.substring(0, index)
      text(chars)
      advance(chars.length)
    }
  }
  return root
}
