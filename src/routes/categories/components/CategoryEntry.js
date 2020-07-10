// @flow

import * as React from 'react'

import { CategoryModel } from '@integreat-app/integreat-api-client'
import iconPlaceholder from '../assets/IconPlaceholder.svg'
import styled, { withTheme } from 'styled-components'
import Highlighter from 'react-highlight-words'
import normalizeSearchString from '../../../modules/common/utils/normalizeSearchString'
import Link from 'redux-first-router-link'
import type { ThemeType } from '../../../modules/theme/constants/theme'

const NUM_WORDS_SURROUNDING_MATCH = 3

const Row = styled.div`
  margin: 12px 0;

  & > * {
    width: 100%;
  }
`

const SubCategory = styled.div`
  text-align: end;

  & > * {
    width: calc(100% - 60px);
    text-align: start;
  }
`

const CategoryThumbnail = styled.img`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  padding: 8px;
  object-fit: contain;
`

const CategoryListItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px 5px;
  color: inherit;
  text-decoration: inherit;
  height: 100%;
  min-width: 1px; /* needed to enable line breaks for too long words, exact value doesn't matter */
  flex-grow: 1;
  word-wrap: break-word;
  border-bottom: 1px solid ${props => props.theme.colors.themeColor};
`

const SubCategoryCaption = styled(CategoryListItem)`
  margin: 0 15px;
  padding: 8px 0;
  border-bottom: 1px solid ${props => props.theme.colors.themeColor};
`
const ContentMatchItem = styled(Highlighter)`
  display: inline-block;
`

const StyledLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  margin: 0 auto;

  &:hover {
    color: inherit;
    text-decoration: inherit;
    transition: background-color 0.5s ease;
    background-color: ${props => props.theme.colors.backgroundAccentColor};
  }
`

type PropsType = {
  category: CategoryModel,
  subCategories: Array<CategoryModel>,
  /** A search query to highlight in the category title */
  query?: string,
  theme: ThemeType
}

/**
 * Displays a single CategoryEntry
 */
class CategoryEntry extends React.PureComponent<PropsType> {
  renderSubCategories (): Array<React.Node> {
    const { subCategories } = this.props
    return subCategories.map(subCategory =>
      <SubCategory key={subCategory.hash}>
        <StyledLink to={subCategory.path}>
          <SubCategoryCaption searchWords={[]} aria-label={subCategory.title} textToHighlight={subCategory.title} />
        </StyledLink>
      </SubCategory>
    )
  }

  getMatchedContent (category: CategoryModel): ContentMatchItem {
    const { query, theme } = this.props
    if (query && query.length >= 1) {
      const normalizedFilter = normalizeSearchString(query)
      const contentWithoutHtml = category.content.replace(/(<([^>]+)>)/ig, '')
      const matchIdx = contentWithoutHtml.toLowerCase().indexOf(normalizedFilter)
      if (matchIdx !== -1) {
        const wordsBeforeMatch = contentWithoutHtml
          .slice(0, matchIdx)
          .split(/[\s,]+/)
        const wordsAfterMatch = contentWithoutHtml
          .slice(matchIdx)
          .split(/[\s,]+/)
        const matchedWord = (wordsBeforeMatch.slice(-NUM_WORDS_SURROUNDING_MATCH, wordsBeforeMatch.length).join(' ')) +
          (wordsAfterMatch.slice(0, NUM_WORDS_SURROUNDING_MATCH).join(' '))
        return <ContentMatchItem aria-label={matchedWord} searchWords={[query]}
                                 sanitize={normalizeSearchString} textToHighlight={matchedWord} highlightStyle={{
          backgroundColor: theme.colors.backgroundColor,
          fontWeight: 'bold'
        }} />
      }
    }
    return null
  }

  renderTitle (): React.Node {
    const { query, category, theme } = this.props
    return <CategoryListItem>
      <Highlighter searchWords={query ? [query] : []} aria-label={category.title}
                       sanitize={normalizeSearchString}
                       highlightStyle={{ backgroundColor: theme.colors.backgroundColor, fontWeight: 'bold' }}
                       textToHighlight={category.title} />
      <div style={{ margin: '0 5px', fontSize: '12px' }}>
        {this.getMatchedContent(category)}
      </div>
    </CategoryListItem>
  }

  render () {
    const { category } = this.props
    return (
      <Row>
        <StyledLink
          to={category.path}>
          <CategoryThumbnail
            alt=''
            src={category.thumbnail || iconPlaceholder}
          />
          {this.renderTitle()}
        </StyledLink>
        {this.renderSubCategories()}
      </Row>
    )
  }
}

export default withTheme(CategoryEntry)
