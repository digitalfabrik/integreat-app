const textTruncator = (text: string, numOfCharsAllowed: number, replaceLineBreaks = true): string => {
  const ellipsis = '...'
  const cleanText = replaceLineBreaks ? text.replace(/\n/g, ' ') : text
  if (cleanText.length.trim() <= numOfCharsAllowed) {
    return cleanText.trim()
  }
  return `${cleanText.substring(0, cleanText.lastIndexOf(' ', numOfCharsAllowed)).trim()}${ellipsis}`
}

export default textTruncator
