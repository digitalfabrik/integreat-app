import { DomUtils, parseDocument, Parser, ParserOptions } from 'htmlparser2'

type ParseHtmlOptions = {
  addPeriods?: boolean
} & ParserOptions

const parseHtmlWithPeriods = (html: string): string => {
  const dom = parseDocument(html)

  const elements = DomUtils.findAll(element => ['p', 'li'].includes(element.tagName), dom.children)
  elements.forEach(element => {
    const textContent = DomUtils.textContent(element).trim()
    if (textContent && !textContent.endsWith('.')) {
      // @ts-expect-error test
      // eslint-disable-next-line no-param-reassign
      element.children = [{ type: 'text', data: `${textContent}.` }]
    }
  })

  return DomUtils.textContent(dom)
}

const parseHTML = (
  html: string,
  { addPeriods, ...options }: ParseHtmlOptions = {
    decodeEntities: true,
    addPeriods: false,
  },
): string => {
  if (addPeriods) {
    return parseHtmlWithPeriods(html)
  }
  let decodedContent = ''

  const parser = new Parser(
    {
      ontext: data => {
        decodedContent += data
      },
    },
    options,
  )

  parser.write(html)
  parser.end()

  return decodedContent
}

export default parseHTML
