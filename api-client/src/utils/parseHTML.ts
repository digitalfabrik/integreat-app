import { Parser, ParserOptions } from 'htmlparser2'

const parseHTML = (html: string, options: ParserOptions = { decodeEntities: true }): string => {
  let decodedContent = ''

  const parser = new Parser(
    {
      ontext: data => {
        decodedContent += data
      },
    },
    options
  )

  parser.write(html)
  parser.end()

  return decodedContent
}

export default parseHTML
