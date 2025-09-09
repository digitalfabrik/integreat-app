import shouldForwardProp from '@emotion/is-prop-valid'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
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

const StyledTypography = styled(Typography)`
  font-weight: 500;
  word-wrap: break-word;

  [dir='rtl'] & {
    font-weight: 600;
  }
`

const StyledSubTypography = styled(StyledTypography)`
  font-weight: 400;

  [dir='rtl'] & {
    font-weight: 400;
  }
`

type CategoryListItemProps = {
  category: CategoryModel
  subCategories: CategoryModel[]
}

const CategoryListItem = ({ category, subCategories }: CategoryListItemProps): ReactElement => {
  const SubCategories = subCategories.map(subCategory => {
    const { path, thumbnail, title } = subCategory
    return (
      <SubCategoryListItem key={path}>
        <StyledSubCategoryListItemButton component={Link} to={path}>
          {!!thumbnail && <CategoryThumbnail alt='' src={thumbnail} />}
          <ListItemText primary={<StyledSubTypography variant='body1'>{title}</StyledSubTypography>} />
        </StyledSubCategoryListItemButton>
      </SubCategoryListItem>
    )
  })

  return (
    <StyledListItem disablePadding>
      <StyledListItemButton component={Link} to={category.path} dir='auto'>
        {!!category.thumbnail && <CategoryThumbnail alt='' src={category.thumbnail} />}
        <ListItemText primary={<StyledTypography variant='body1'>{category.title}</StyledTypography>} />
      </StyledListItemButton>
      <Divider />
      {SubCategories.length > 0 && <StyledList NoItemsMessage='noItems' items={SubCategories} />}
    </StyledListItem>
  )
}

export default CategoryListItem
