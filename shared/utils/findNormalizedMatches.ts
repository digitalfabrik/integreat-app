import { Chunk, FindAll, findAll, findChunks, FindChunks } from 'highlight-words-core'

import normalizeString from './normalizeString'
import { MATCH_WHITESPACE_AND_DASHES } from './search'

const charsAddedByNormalization = (text: string, until: number) => {
  let charsAdded = 0
  for (let i = 0; i < until - charsAdded; i += 1) {
    if (text[i] === 'ß') {
      charsAdded += 1
    }
  }
  return charsAdded
}

const findNormalizedMatches = (props: FindChunks): Chunk[] => {
  const normalized = normalizeString(props.textToHighlight)
  return (
    findChunks(props)
      // Match at the beginning or in the middle where the new word starts
      .filter(chunk => chunk.start === 0 || MATCH_WHITESPACE_AND_DASHES.test(normalized[chunk.start - 1] ?? ''))
      .map(chunk => {
        const charsAddedBeforeMatch = charsAddedByNormalization(props.textToHighlight, chunk.start)
        const charsAddedIncludingMatch = charsAddedByNormalization(props.textToHighlight, chunk.end)
        return {
          ...chunk,
          start: chunk.start - charsAddedBeforeMatch,
          end: chunk.end - charsAddedIncludingMatch,
        }
      })
  )
}

export const findAllMatches: (args: FindAll) => Chunk[] = findAll

export default findNormalizedMatches
