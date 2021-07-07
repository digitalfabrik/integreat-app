import { Parser, ParserOptions } from 'htmlparser2'

export function parseHTML(html: string, options: ParserOptions): string {
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

  return decodedContent;
}
