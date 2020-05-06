// @flow

export type HelpersType = {
  removeLinkHighlighting: string
}

export default {
  removeLinkHighlighting: `
    color: inherit;
    text-decoration: none;
  `
}

export const textTruncator = (text, numOfWordsAllowed) => {
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
