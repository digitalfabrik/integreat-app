import { normalizeString } from './search'

type TruncateTextOptions = {
  maxChars: number
  replaceLineBreaks?: boolean
  reverse?: boolean
}

export const truncate = (
  text: string,
  { maxChars, replaceLineBreaks = true, reverse = false }: TruncateTextOptions
): string => {
  const inlinedText = replaceLineBreaks ? text.replace(/\n/g, ' ') : text
  const trimmedText = inlinedText.trim()
  const length = trimmedText.length

  if (length <= maxChars) {
    return trimmedText
  }

  const ellipsis = '...'
  const actualMaxChars = maxChars - ellipsis.length - 1

  if (reverse) {
    const truncatedText = trimmedText.substring(trimmedText.indexOf(' ', length - actualMaxChars - 1)).trim()
    return `${ellipsis} ${truncatedText}`
  }

  const truncatedText = trimmedText.substring(0, trimmedText.lastIndexOf(' ', actualMaxChars)).trim()
  return `${truncatedText} ${ellipsis}`
}

type ExcerptOptions = {
  replaceLineBreaks?: boolean
  query?: string
  maxChars: number
}

const getExcerpt = (text: string, { query, maxChars, replaceLineBreaks }: ExcerptOptions): string => {
  const normalizedText = normalizeString(text)

  if (!query) {
    return truncate(text, { maxChars, replaceLineBreaks })
  }

  const normalizedQuery = normalizeString(query)
  const matchIndex = normalizedText.indexOf(normalizedQuery)

  if (!matchIndex || text.trim().length <= maxChars) {
    return truncate(text, { maxChars, replaceLineBreaks })
  }

  if (query.length >= maxChars) {
    return truncate(query, { maxChars, replaceLineBreaks })
  }

  const indexAfterMatch = matchIndex + query.length
  const remainingChars = maxChars - query.length
  const charsBeforeMatch = matchIndex
  const charsAfterMatch = text.length - indexAfterMatch

  const maxCharsBeforeMatch =
    charsAfterMatch < remainingChars / 2 ? remainingChars - charsAfterMatch : remainingChars / 2
  const maxCharsAfterMatch =
    charsBeforeMatch < remainingChars / 2 ? remainingChars - charsBeforeMatch : remainingChars / 2

  const excerptBeforeMatch = truncate(text.substring(0, matchIndex), {
    reverse: true,
    maxChars: maxCharsBeforeMatch,
    replaceLineBreaks,
  })
  const excerptAfterMatch = truncate(text.substring(indexAfterMatch), {
    maxChars: maxCharsAfterMatch,
    replaceLineBreaks,
  })
  const match = text.substring(matchIndex, indexAfterMatch)

  const spaceBeforeMatch = text.charAt(matchIndex - 1) === ' ' ? ' ' : ''
  const spaceAfterMatch = text.charAt(indexAfterMatch) === ' ' ? ' ' : ''

  return `${excerptBeforeMatch}${spaceBeforeMatch}${match}${spaceAfterMatch}${excerptAfterMatch}`
}

export default getExcerpt
