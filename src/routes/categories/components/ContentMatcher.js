// @flow

import normalizeSearchString from '../../../modules/common/utils/normalizeSearchString'

class ContentMatcher {
  getWords (content: string): Array<string> {
    return content.split(/\s+/).filter(Boolean)
  }

  getContentBeforeMatchIndex (content: string, matchIdx: number, startOfWord: boolean, numWords: number): string {
    const wordsBeforeMatch = this.getWords(content.slice(0, matchIdx))
    const additionalWordBefore = startOfWord ? 0 : 1
    const limitedMatchBefore = wordsBeforeMatch
      .slice(-numWords - additionalWordBefore, wordsBeforeMatch.length)
      .join(' ')
    return limitedMatchBefore + (startOfWord ? ' ' : '')
  }

  getContentAfterMatchIndex (content: string, matchIdx: number, numWords: number): string {
    const wordsAfterMatch = this.getWords(content.slice(matchIdx))
    return wordsAfterMatch
      .slice(0, numWords + 1)
      .join(' ')
  }

  getMatchedContent (query: string, content: string, numWordsSurrounding: number): string {
    if (!query || !query.length || !content) {
      return null
    }
    const normalizedFilter = normalizeSearchString(query)

    const matchIdx = content.toLowerCase().indexOf(normalizedFilter)
    if (matchIdx === -1) {
      return null
    }

    const queryMatchesStartOfWord = !content.charAt(matchIdx - 1).trim()
    const contentBefore = this.getContentBeforeMatchIndex(
      content,
      matchIdx,
      queryMatchesStartOfWord,
      numWordsSurrounding)
    const contentAfter = this.getContentAfterMatchIndex(content, matchIdx, numWordsSurrounding)
    return contentBefore + contentAfter
  }
}

export default ContentMatcher
