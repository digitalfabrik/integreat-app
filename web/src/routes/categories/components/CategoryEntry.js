// @flow

import * as React from 'react'

import { CategoryModel } from 'api-client'
import iconPlaceholder from '../assets/IconPlaceholder.svg'
import styled, { withTheme } from 'styled-components'
import Highlighter from 'react-highlight-words'
import normalizeSearchString from '../../../modules/common/utils/normalizeSearchString'
import Link from 'redux-first-router-link'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import ContentMatcher from './ContentMatcher'

const NUM_WORDS_SURROUNDING_MATCH = 10

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

type PropsType = {|
  category: CategoryModel,
  contentWithoutHtml: string,
  subCategories: Array<CategoryModel>,
  /** A search query to highlight in the category title */
  query?: string,
  theme: ThemeType
|}

/**
 * Displays a single CategoryEntry
 */
class CategoryEntry extends React.PureComponent<PropsType> {
  contentMatcher = new ContentMatcher()

  renderSubCategories (): Array<React.Node> {
    const { subCategories } = this.props
    return subCategories.map(subCategory =>
      <SubCategory key={subCategory.hash}>
        <StyledLink to={subCategory.path}>
          <SubCategoryCaption aria-label={subCategory.title}>{subCategory.title}</SubCategoryCaption>
        </StyledLink>
      </SubCategory>
    )
  }

  getMatchedContent (numWordsSurrounding: number): typeof ContentMatchItem {
    const { query, theme, contentWithoutHtml } = this.props
    const textToHighlight = this.contentMatcher.getMatchedContent(query, contentWithoutHtml, numWordsSurrounding)
    if (textToHighlight == null) {
      return null
    }

    return <ContentMatchItem aria-label={textToHighlight}
                             searchWords={[query]}
                             autoEscape
                             sanitize={normalizeSearchString}
                             textToHighlight={textToHighlight}
                             highlightStyle={{ backgroundColor: theme.colors.backgroundColor, fontWeight: 'bold' }} />
  }

  renderTitle (): React.Node {
    const { query, category, theme } = this.props
    return <CategoryListItem>
      <Highlighter searchWords={query ? [query] : []}
                   aria-label={category.title}
                   autoEscape
                   sanitize={normalizeSearchString}
                   highlightStyle={{ backgroundColor: theme.colors.backgroundColor, fontWeight: 'bold' }}
                   textToHighlight={category.title} />
      <div style={{ margin: '0 5px', fontSize: '12px' }}>
        {this.getMatchedContent(NUM_WORDS_SURROUNDING_MATCH)}
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
