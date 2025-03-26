import { Parser, ParserOptions } from 'htmlparser2'

const parseHTML = (html: string, options: ParserOptions = { decodeEntities: true }): string => {
  let decodedContent = ''

  const parser = new Parser(
    {
      ontext: data => {
        decodedContent += data
      },
      // Explicitly add linebreaks for list elements to fix text segmentation
      onopentag: (name: string) => {
        if (name === 'li') {
          decodedContent += '\n'
        }
      },
    },
    options,
  )

  parser.write(html)
  parser.end()

  return decodedContent.replace(/\r/g, '')
}

export default parseHTML
