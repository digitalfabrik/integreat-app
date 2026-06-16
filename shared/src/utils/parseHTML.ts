import { Parser, ParserOptions } from 'htmlparser2'

// This regex matches numbers with 5 or more digits to add spaces in between for phone numbers and postal codes.
const formatLongNumbers = (text: string) => text.replace(/\d{5,}/g, match => match.split('').join(' '))

const parseHTML = (
  html: string,
  optimizeNumbersForTts?: boolean,
  options: ParserOptions = { decodeEntities: true },
): string => {
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
        if (name === 'p') {
          decodedContent += '\n'
        }
        if (name === 'br') {
          decodedContent += '\n'
        }
      },
    },
    options,
  )

  parser.write(html)
  parser.end()

  const parsed = decodedContent.replace(/\r/g, '').trim()
  return optimizeNumbersForTts ? formatLongNumbers(parsed) : parsed
}

export default parseHTML
