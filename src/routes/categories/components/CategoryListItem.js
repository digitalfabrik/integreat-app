// @flow

import * as React from 'react'

import CategoryModel from 'modules/endpoint/models/CategoryModel'
import iconPlaceholder from '../assets/IconPlaceholder.svg'
import {
  CategoryCaption,
  CategoryThumbnail, Row,
  StyledLink, SubCategoryCaption, SubCategory
} from './CategoryListItem.styles'

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
          <CategoryThumbnail src={category.thumbnail || iconPlaceholder} />
          {this.renderTitle()}
        </StyledLink>
        {this.renderSubCategories()}
      </Row>
    )
  }
}

export default CategoryListItem
