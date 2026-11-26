import { findAll, findChunks, FindChunksOptions, FoundChunk } from 'highlight-words-core'

import { normalizeCharacters } from './normalizeString.ts'
import { MATCH_WHITESPACE_AND_DASHES } from './search.ts'

const findNormalizedMatches = (
  props: FindChunksOptions,
  { wordStartOnly = false }: { wordStartOnly?: boolean } = {},
): FoundChunk[] => {
  const chunks = findChunks(props)
  if (!wordStartOnly) {
    return chunks
  }

  return chunks.filter(
    // Match at the beginning or in the middle where the new word starts
    chunk =>
      chunk.start === 0 ||
      MATCH_WHITESPACE_AND_DASHES.test(normalizeCharacters(props.textToHighlight[chunk.start - 1] ?? '')),
  )
}

export const findAllMatches = findAll

export default findNormalizedMatches
