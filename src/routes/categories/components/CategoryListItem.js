// @flow

import React from 'react'

import CategoryModel from 'modules/endpoint/models/CategoryModel'
import iconPlaceholder from '../assets/IconPlaceholder.svg'
import {
  CategoryCaption,
  CategoryThumbnail, Row,
  StyledLink, SubCategoryCaption, SubCategory
} from './CategoryListItem.styles'

type Props = {
  category: CategoryModel,
  subCategories: ?Array<CategoryModel>,
  /** A search query to highlight in the category title */
  query?: string
}

/**
 * Displays a single CategoryListItem
 */
class CategoryListItem extends React.Component<Props> {
  getChildren () {
    const {subCategories} = this.props
    return subCategories && subCategories.map(child =>
      <SubCategory key={child.id}>
        <StyledLink to={child.path}>
          <SubCategoryCaption search={''}>
            {child.title}
            </SubCategoryCaption>
        </StyledLink>
      </SubCategory>
    )
  }

  getTitle () {
    const {query, subCategories} = this.props
    return <CategoryCaption search={query || ''} subCategories={subCategories}>
      {this.props.category.title}
    </CategoryCaption>
  }

  render () {
    const {category} = this.props
    return (
      <Row>
        <StyledLink to={category.path}>
          <CategoryThumbnail src={category.thumbnail || iconPlaceholder} />
          {this.getTitle()}
        </StyledLink>
        {this.getChildren()}
      </Row>
    )
  }
}

export default CategoryListItem
