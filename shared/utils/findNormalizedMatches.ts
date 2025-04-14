import { Chunk, findAll, findChunks, FindChunks } from 'highlight-words-core'

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
  const chunks: Chunk[] = findChunks(props)
  return chunks.map(chunk => {
    const charsAddedBeforeMatch = charsAddedByNormalization(props.textToHighlight, chunk.start)
    const charsAddedIncludingMatch = charsAddedByNormalization(props.textToHighlight, chunk.end)
    return {
      ...chunk,
      start: chunk.start - charsAddedBeforeMatch,
      end: chunk.end - charsAddedIncludingMatch,
    }
  })
}

export const findAllMatches = findAll

export default findNormalizedMatches
