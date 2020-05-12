// @flow

const textTruncator = (text: string, numOfWordsAllowed: number): string => {
  const ellipsis = '...'
  const splitTextToWords = text.split(' ')
  if (splitTextToWords.length < numOfWordsAllowed) {
    return text
  }

  const shortenedArrayOfText = splitTextToWords.splice(0, numOfWordsAllowed)
  const joinShorterendArray = shortenedArrayOfText.join(' ')
  const textTruncated = joinShorterendArray + ellipsis

  return textTruncated
}

export default textTruncator
