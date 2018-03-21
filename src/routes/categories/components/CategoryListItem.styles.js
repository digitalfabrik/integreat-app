// @flow

import React from 'react'
import { Link } from 'redux-little-router'
import Highlighter from 'react-highlighter'

import CategoryModel from 'modules/endpoint/models/CategoryModel'
import iconPlaceholder from '../assets/IconPlaceholder.svg'
import styled from 'styled-components'

type Props = {
  category: CategoryModel,
  children: Array<CategoryModel>,
  /** A search query to highlight in the category title */
  query?: string
}

/**
 * Displays a single CategoryListItem
 */
class CategoryListItem extends React.Component<Props> {
  getChildren () {
    return this.props.children.map(child =>
      <div key={child.id}>
        <StyledLink href={child.url}>
          {
            child.thumbnail
              ? <SubCategoryThumbnail src={child.thumbnail} />
              : <SubCategoryThumbnailDiv />
          }
          <SubCategoryCaption>{child.title}</SubCategoryCaption>
        </StyledLink>
      </div>
    )
  }

  getTitle () {
    return <CategoryCaption search={this.props.query || ''}>
      {this.props.category.title}
    </CategoryCaption>
  }

  render () {
    const {category} = this.props
    return (
      <Row>
        <StyledLink href={category.url}>
          <CategoryThumbnail src={category.thumbnail || iconPlaceholder} />
          {this.getTitle()}
        </StyledLink >
        {this.getChildren()}
      </Row>
    )
  }
}

export default CategoryListItem
