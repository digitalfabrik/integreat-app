// @flow

import normalizeSearchString from '../../../modules/common/utils/normalizeSearchString'

class ContentMatcher {
  getWords(content: string): Array<string> {
    return content.split(/\s+/).filter(Boolean)
  }

  getContentBeforeMatchIndex(content: string, matchIndex: number, startOfWord: boolean, numWords: number): string {
    const wordsBeforeMatch = this.getWords(content.slice(0, matchIndex))
    const additionalWordBefore = startOfWord ? 0 : 1
    const limitedMatchBefore = wordsBeforeMatch
      .slice(-numWords - additionalWordBefore, wordsBeforeMatch.length)
      .join(' ')
    return limitedMatchBefore + (startOfWord ? ' ' : '')
  }

  getContentAfterMatchIndex(content: string, matchIndex: number, numWords: number): string {
    const wordsAfterMatch = this.getWords(content.slice(matchIndex))
    return wordsAfterMatch.slice(0, numWords + 1).join(' ')
  }

  getMatchedContent(query: ?string, content: ?string, numWordsSurrounding: number): ?string {
    if (!query || !query.length || !content) {
      return null
    }
    const normalizedFilter = normalizeSearchString(query)

    const matchIndex = normalizeSearchString(content).indexOf(normalizedFilter)
    if (matchIndex === -1) {
      return null
    }

    const queryMatchesStartOfWord = !content.charAt(matchIndex - 1).trim()
    const contentBefore = this.getContentBeforeMatchIndex(
      content,
      matchIndex,
      queryMatchesStartOfWord,
      numWordsSurrounding
    )
    const contentAfter = this.getContentAfterMatchIndex(content, matchIndex, numWordsSurrounding)
    return contentBefore + contentAfter
  }
}

export default ContentMatcher
