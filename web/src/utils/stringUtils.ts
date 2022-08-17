export const textTruncator = (text: string, numOfCharsAllowed: number, replaceLineBreaks = true): string => {
  const ellipsis = '...'
  const cleanText = replaceLineBreaks ? text.replace(/\n/g, ' ') : text
  if (cleanText.length < numOfCharsAllowed) {
    return cleanText
  }
  return `${cleanText.substring(0, cleanText.lastIndexOf(' ', numOfCharsAllowed))}${ellipsis}`
}

/**
 * @param path: a slash-prefixed path
 * @returns {string} the url of the current host and the specified path
 */
export const urlFromPath = (path: string): string => `${window.location.origin}${path}`

export const pathnameFromUrl = (url: string): string => new URL(url).pathname
