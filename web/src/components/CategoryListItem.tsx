import React, { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { CategoryModel } from 'api-client'

const Row = styled.li`
  width: 100%;
`

const SubCategoriesContainer = styled.ul`
  list-style-type: none;
`

const SubCategory = styled.li`
  text-align: start;
  width: 100%;
`

const CategoryThumbnail = styled.img`
  width: 30px;
  height: 30px;
  padding: 0 5px;
  flex-shrink: 0;
  object-fit: contain;
`

const CategoryItemCaption = styled.span`
  align-items: center;
  padding: 15px 5px;
  color: inherit;
  font-size: ${props => props.theme.fonts.contentFontSize};
  font-weight: bold;
  text-decoration: inherit;
  height: 100%;
  min-width: 1px; /* needed to enable line breaks for too long words, exact value doesn't matter */
  flex-grow: 1;
  word-wrap: break-word;
`

const SubCategoryCaption = styled(CategoryItemCaption)`
  padding: 10px 5px;
  font-weight: 400;
`

const StyledLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  margin: 0 auto;
  width: inherit;
  border-bottom: 1px solid ${props => props.theme.colors.themeColor};

  &:hover {
    color: inherit;
    text-decoration: inherit;
    transition: background-color 0.5s ease;
    background-color: ${props => props.theme.colors.backgroundAccentColor};
  }
`

type CategoryListItemProps = {
  category: CategoryModel
  subCategories: CategoryModel[]
}

const CategoryListItem = ({ category, subCategories }: CategoryListItemProps): ReactElement => {
  const SubCategories = subCategories.map(subCategory => (
    <SubCategory key={subCategory.path} dir='auto'>
      <StyledLink to={subCategory.path}>
        {!!subCategory.thumbnail && <CategoryThumbnail alt='' src={subCategory.thumbnail} />}
        <SubCategoryCaption>{subCategory.title}</SubCategoryCaption>
      </StyledLink>
    </SubCategory>
  ))

  return (
    <Row>
      <StyledLink dir='auto' to={category.path}>
        {!!category.thumbnail && <CategoryThumbnail alt='' src={category.thumbnail} />}
        <CategoryItemCaption>{category.title}</CategoryItemCaption>
      </StyledLink>
      <SubCategoriesContainer>{SubCategories}</SubCategoriesContainer>
    </Row>
  )
}

export default CategoryListItem
