import normalizeString from './normalizeString'

const mapReplacedString = (
  text: string,
  map: [string, string][],
): { sanitizedText: string; replacementMap: number[] } => {
  let transformed = ''
  const repMap: number[] = []
  let i = 0
  let matcher
  while (i < text.length) {
    const findMatch = (index: number) => (element: [string, string]) => text.startsWith(element[0], index)

    matcher = map.find(findMatch(i))
    if (matcher) {
      transformed += matcher[1]
      repMap.push(...Array(matcher[1].length).fill(i))
      i += matcher[0].length
    } else {
      transformed += text[i]
      repMap.push(i)
      i += 1
    }
  }
  return {
    sanitizedText: transformed,
    replacementMap: repMap,
  }
}

export const findMatchingSections = ({
  searchWords,
  textToHighlight,
}: {
  searchWords: (string | RegExp)[]
  textToHighlight: string
}): { start: number; end: number }[] => {
  const { sanitizedText, replacementMap } = mapReplacedString(normalizeString(textToHighlight), [['ß', 'ss']])

  let result: { start: number; end: number }[] = []
  if (replacementMap.length > 0) {
    searchWords.forEach((word: string | RegExp) => {
      let matches: { start: number; end: number }[] = []
      if (typeof word === 'string' && word !== '') {
        const sanitizedWord = normalizeString(word).replace('ß', 'ss')
        const regex = new RegExp(sanitizedWord, 'gi')

        matches = [...sanitizedText.matchAll(regex)].map(match => {
          const start = replacementMap[match.index]
          const end = replacementMap[match.index + match[0].length] ?? textToHighlight.length
          if (start !== undefined && !Number.isNaN(start) && !Number.isNaN(end)) {
            return {
              start,
              end,
            }
          }
          return { start: 0, end: 0 }
        })
      }

      if (matches.length > 0) {
        result = result.concat(matches)
      }
    })
  }

  return result
}

export default findMatchingSections
