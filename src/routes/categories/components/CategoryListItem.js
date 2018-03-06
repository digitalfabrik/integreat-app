import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'redux-little-router'

import CategoryModel from 'modules/endpoint/models/CategoryModel'
import iconPlaceholder from '../assets/IconPlaceholder.svg'
import styled from 'styled-components'
import { themeColor } from '../../../modules/common/constants/colors'

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

const CategoryCaption = styled.div`
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

/**
 * Displays a single CategoryListItem
 */
class CategoryListItem extends React.Component {
  static propTypes = {
    category: PropTypes.instanceOf(CategoryModel).isRequired,
    children: PropTypes.arrayOf(PropTypes.instanceOf(CategoryModel)).isRequired
  }

  render () {
    const {category, children} = this.props
    return (
      <Row>
        <StyledLink href={category.url}>
          <CategoryThumbnail src={category.thumbnail || iconPlaceholder} />
          <CategoryCaption>{category.title}</CategoryCaption>
        </StyledLink >
        {children.map(child =>
          <StyledLink key={child.id} href={child.url}>
            {
              child.thumbnail
              ? <SubCategoryThumbnail src={child.thumbnail} />
              : <SubCategoryThumbnailDiv />
            }
            <SubCategoryCaption>{child.title}</SubCategoryCaption>
          </StyledLink>
        )}
      </Row>
    )
  }
}

export default CategoryListItem
