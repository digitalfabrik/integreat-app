// @flow

import React from 'react'
import { Link } from 'redux-little-router'
import Highlighter from 'react-highlighter'

import CategoryModel from 'modules/endpoint/models/CategoryModel'
import iconPlaceholder from '../assets/IconPlaceholder.svg'
import styled from 'styled-components'
import { themeColor } from '../../../modules/app/constants/colors'

const Row = styled.div`margin: 20px 0;`

const CategoryThumbnail = styled.img`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  padding: 8px;
  object-fit: contain;
`

const SubCategoryThumbnail = CategoryThumbnail.extend`
  width: 26px;
  height: 26px;
  padding: 5px 15px;
`
const SubCategoryThumbnailDiv = SubCategoryThumbnail.withComponent('div')

const CategoryCaption = styled(Highlighter)`
  height: 100%;
  min-width: 1px; /* needed to enabled line breaks for to long words, exact value doesn't matter, @Max: DO NOT CHANGE */
  flex-grow: 1;
  margin-left: 10px;
  padding: 15px 0;
  border-bottom: 2px solid ${themeColor};
  word-wrap: break-word;
`

const SubCategoryCaption = CategoryCaption.extend`
  padding: 10px 0 10px 15px;
  border-bottom: 1px solid ${themeColor};
`

const StyledLink = styled(Link)`
  display: flex;
  width: 100%;
  max-width: 700px;
  align-items: center;
  margin: 0 auto;
`

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
