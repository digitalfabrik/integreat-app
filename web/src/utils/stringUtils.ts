import normalizeStrings from 'normalize-strings'

export const textTruncator = (text: string, numOfWordsAllowed: number): string => {
  const ellipsis = '...'
  const words = text.replace('\n', '').split(' ')

  if (words.length < numOfWordsAllowed) {
    return text
  }

  const truncatedText = words.splice(0, numOfWordsAllowed).join(' ')
  return truncatedText + ellipsis
}

export const normalizeSearchString = (str: string): string => normalizeStrings(str).toLowerCase()

/**
 * @param path: a slash-prefixed path
 * @returns {string} the url of the current host and the specified path
 */
export const urlFromPath = (path: string): string => {
  return `${location.origin}${path}`
}
