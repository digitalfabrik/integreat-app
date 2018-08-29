// @flow

import * as React from 'react'

import CategoryModel from 'modules/endpoint/models/CategoryModel'
import iconPlaceholder from '../assets/IconPlaceholder.svg'
import styled from 'styled-components'

const Row = styled.View`
  margin: 12px 0;
`

const SubCategory = styled.View`
`

const CategoryThumbnail = styled.Image`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  padding: 8px;
`

const CategoryCaption = styled.Text`
  height: 100%;
  flex-grow: 1;
  padding: 15px 5px;
  border-bottom-width: 2px;
  border-bottom-color: ${props => props.theme.colors.themeColor};
`

const SubCategoryCaption = styled(CategoryCaption)`
  padding: 8px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.themeColor};
`

const StyledLink = styled.View`
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
class CategoryListItem extends React.Component<PropsType> {
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
          <CategoryThumbnail source={category.thumbnail ? {uri: category.thumbnail} : iconPlaceholder} />
          {this.renderTitle()}
        </StyledLink>
        {this.renderSubCategories()}
      </Row>
    )
  }
}

export default CategoryListItem
