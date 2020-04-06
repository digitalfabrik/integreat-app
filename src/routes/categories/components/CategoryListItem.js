// @flow

import * as React from 'react'

import { CategoryModel } from '@integreat-app/integreat-api-client'
import iconPlaceholder from '../assets/IconPlaceholder.svg'
import styled, { withTheme } from 'styled-components'
import Highlighter from 'react-highlight-words'
import normalizeSearchString from '../../../modules/common/utils/normalizeSearchString'
import Link from 'redux-first-router-link'
import type { ThemeType } from '../../../modules/theme/constants/theme'

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

const CategoryCaption = styled(Highlighter)`
  height: 100%;
  min-width: 1px; /* needed to enable line breaks for too long words, exact value doesn't matter */
  flex-grow: 1;
  padding: 15px 5px;
  border-bottom: 2px solid ${props => props.theme.colors.themeColor};
  word-wrap: break-word;
`

const SubCategoryCaption = styled(CategoryCaption)`
  margin: 0 15px;
  padding: 8px 0;
  border-bottom: 1px solid ${props => props.theme.colors.themeColor};
`

const StyledLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  margin: 0 auto;
`

type PropsType = {
  category: CategoryModel,
  subCategories: Array<CategoryModel>,
  /** A search query to highlight in the category title */
  query?: string,
  theme: ThemeType
}

/**
 * Displays a single CategoryListItem
 */
class CategoryListItem extends React.PureComponent<PropsType> {
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

  renderTitle (): React.Node {
    const { query, category, theme } = this.props
    return <CategoryCaption searchWords={query ? [query] : []} aria-label={category.title} sanitize={normalizeSearchString}
                            highlightStyle={{ backgroundColor: theme.colors.themeColor }}
                            textToHighlight={category.title} />
  }

  render () {
    const { category } = this.props
    return (
      <Row>
        <StyledLink to={category.path}>
          <CategoryThumbnail alt='' src={category.thumbnail || iconPlaceholder} />
          {this.renderTitle()}
        </StyledLink>
        {this.renderSubCategories()}
      </Row>
    )
  }
}

export default withTheme(CategoryListItem)
