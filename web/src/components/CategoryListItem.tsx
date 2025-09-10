import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
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

const StyledSubCategoryListItemButton = styled(ListItemButton)`
  padding-left: 56px;
` as typeof ListItemButton

const StyledTypography = styled(Typography)`
  word-wrap: break-word;

  [dir='rtl'] & {
    font-weight: 700;
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
          {!!thumbnail && (
            <ListItemAvatar>
              <Avatar src={thumbnail} variant='square' />
            </ListItemAvatar>
          )}
          <ListItemText primary={<Typography variant='body1'>{title}</Typography>} />
        </StyledSubCategoryListItemButton>
      </SubCategoryListItem>
    )
  })

  return (
    <StyledListItem disablePadding>
      <ListItemButton component={Link} to={category.path} dir='auto'>
        {!!category.thumbnail && (
          <ListItemAvatar>
            <Avatar src={category.thumbnail} variant='square' />
          </ListItemAvatar>
        )}
        <ListItemText primary={<StyledTypography variant='title2'>{category.title}</StyledTypography>} />
      </ListItemButton>
      <Divider />
      <StyledList items={SubCategories} />
    </StyledListItem>
  )
}

export default CategoryListItem
