// @flow

import React from 'react'
import { CategoryModel } from '@integreat-app/integreat-api-client'
import type { ThemeType } from '../../../../build-configs/themes/ThemeType'
import normalizeSearchString from '../../../modules/common/utils/normalizeSearchString'
import Highlighter from 'react-highlight-words'
import styled, { withTheme } from 'styled-components'

const WORDS_BEFORE = 3
const WORDS_AFTER = 3

const ContentMatchItem = styled(Highlighter)`
  display: inline-block;
`

type PropsType = {|
  category: CategoryModel,
  filterText: string,
  theme: ThemeType
|}

class CategoryMatch extends React.PureComponent<PropsType> {
  getMatchedContent (): string {
    const { category, filterText } = this.props
    const normalizedFilter = normalizeSearchString(filterText)
    if (normalizedFilter >= 1) {
      const matchIdx = category.content.indexOf(normalizedFilter)
      if (matchIdx !== -1) {
        const wordsBeforeMatch = category.content
          .slice(0, matchIdx)
          .split(' ')
        const wordsAfterMatch = category.content
          .slice(matchIdx + normalizedFilter.length)
          .split(' ')
        const contentBefore = (wordsBeforeMatch.length > WORDS_BEFORE
          ? wordsBeforeMatch.slice(-WORDS_BEFORE) : wordsBeforeMatch).join(' ')
        const contentAfter = (wordsAfterMatch.length > WORDS_AFTER
          ? wordsAfterMatch.slice(0, WORDS_AFTER) : wordsBeforeMatch).join(' ')
        return contentBefore + filterText + contentAfter
      }
    }
    return ''
  }

  render () {
    const { query, theme } = this.props
    const content = this.getMatchedContent()
    return <ContentMatchItem key={content} aria-label={content} searchWords={[query]} sanitize={normalizeSearchString}
                             textToHighlight={content}
                             highlightStyle={{ backgroundColor: theme.colors.backgroundColor, fontWeight: 'bold' }} />
  }
}

export default withTheme(CategoryMatch)
