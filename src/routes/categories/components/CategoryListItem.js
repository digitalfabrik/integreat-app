// @flow

import * as React from 'react'

import { CategoryModel } from '@integreat-app/integreat-api-client'
import iconPlaceholder from '../assets/IconPlaceholder.svg'
import styled from 'styled-components'
import Highlighter from 'react-highlighter'
import Link from 'redux-first-router-link'

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
  min-width: 1px; /* needed to enable line breaks for to long words, exact value doesn't matter */
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
  query?: string
}

/**
 * Displays a single CategoryListItem
 */
class CategoryListItem extends React.PureComponent<PropsType> {
  renderSubCategories (): Array<React.Node> {
    const {subCategories} = this.props
    return subCategories.map(subCategory =>
      <SubCategory key={subCategory.id}>
        <StyledLink to={subCategory.path}>
          <SubCategoryCaption search={''}>
            {subCategory.title}
          </SubCategoryCaption>
        </StyledLink>
      </SubCategory>
    )
  }

  renderTitle (): React.Node {
    const {query} = this.props
    return <CategoryCaption search={query || ''}>
      {this.props.category.title}
    </CategoryCaption>
  }

  render () {
    const {category} = this.props
    return (
      <Row>
        <StyledLink to={category.path}>
          <CategoryThumbnail src={category.thumbnail || iconPlaceholder} />
          {this.renderTitle()}
        </StyledLink>
        {this.renderSubCategories()}
      </Row>
    )
  }
}

export default CategoryListItem
