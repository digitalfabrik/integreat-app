import shouldForwardProp from '@emotion/is-prop-valid'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import { CategoryModel } from 'shared/api'

import Link from './base/Link'
import List from './base/List'

const StyledList = styled(List)`
  padding: 0;
`

const StyledListItem = styled(ListItem)`
  padding: 0;
  flex-direction: column;
  align-items: stretch;
`

const SubCategoryListItem = styled(ListItem)`
  padding: 0;
`

const StyledListItemButton = styled(ListItemButton, { shouldForwardProp })`
  min-height: 56px;
` as typeof ListItemButton

const StyledSubCategoryListItemButton = styled(StyledListItemButton)`
  padding-left: 56px;
` as typeof ListItemButton

const CategoryThumbnail = styled('img')`
  width: 24px;
  height: 24px;
  margin-right: 16px;
  flex-shrink: 0;
  object-fit: contain;
  filter: ${props => (props.theme.isContrastTheme ? 'invert(1)' : 'none')};
`

const CategoryItemCaption = styled(Typography)`
  font-weight: 500;
  word-wrap: break-word;
`

const SubCategoryCaption = styled(CategoryItemCaption)`
  font-weight: 400;
`

type CategoryListItemProps = {
  category: CategoryModel
  subCategories: CategoryModel[]
}

const CategoryListItem = ({ category, subCategories }: CategoryListItemProps): ReactElement => {
  const SubCategories = subCategories.map(subCategory => (
    <SubCategoryListItem key={subCategory.path}>
      <StyledSubCategoryListItemButton component={Link} to={subCategory.path}>
        {!!subCategory.thumbnail && <CategoryThumbnail alt='' src={subCategory.thumbnail} />}
        <SubCategoryCaption>{subCategory.title}</SubCategoryCaption>
      </StyledSubCategoryListItemButton>
    </SubCategoryListItem>
  ))

  return (
    <StyledListItem>
      <StyledListItemButton component={Link} to={category.path} dir='auto'>
        {!!category.thumbnail && <CategoryThumbnail alt='' src={category.thumbnail} />}
        <CategoryItemCaption variant='body1'>{category.title}</CategoryItemCaption>
      </StyledListItemButton>
      <Divider />
      {SubCategories.length > 0 && <StyledList lastDivider={false} NoItemsMessage='noItems' items={SubCategories} />}
    </StyledListItem>
  )
}

export default CategoryListItem
