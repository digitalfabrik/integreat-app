const textTruncator = (text: string, numOfCharsAllowed: number, replaceLineBreaks = true): string => {
  const ellipsis = '...'
  const cleanText = replaceLineBreaks ? text.trim().replace(/\n/g, ' ') : text
  if (cleanText.length < numOfCharsAllowed) {
    return cleanText
  }
  return `${cleanText.substring(0, cleanText.lastIndexOf(' ', numOfCharsAllowed))}${ellipsis}`
}

export default textTruncator
