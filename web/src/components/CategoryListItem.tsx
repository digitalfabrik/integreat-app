import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import { CategoryModel } from 'shared/api'

import Link from './base/Link'
import List from './base/List'

const StyledListItem = styled(ListItem)`
  flex-direction: column;
  align-items: stretch;
`

const StyledImage = styled('img')`
  width: 40px;
  height: 40px;
  filter: ${props => (props.theme.isContrastTheme ? 'invert(1)' : 'none')};
`
const StyledListItemButton = styled(ListItemButton)`
  min-height: 56px;
` as typeof ListItemButton

type CategoryListItemProps = {
  category: CategoryModel
  subCategories: CategoryModel[]
}

const CategoryListItem = ({ category, subCategories }: CategoryListItemProps): ReactElement => {
  const SubCategories = subCategories.map(subCategory => {
    const { path, title } = subCategory
    return (
      <ListItem disablePadding key={path}>
        <StyledListItemButton component={Link} to={path}>
          <ListItemText primary={<Typography variant='body1'>{title}</Typography>} />
        </StyledListItemButton>
      </ListItem>
    )
  })

  return (
    <StyledListItem disablePadding>
      <ListItemButton component={Link} to={category.path}>
        {!!category.thumbnail && (
          <ListItemIcon>
            <StyledImage src={category.thumbnail} alt='' />
          </ListItemIcon>
        )}
        <ListItemText
          primary={
            <Typography fontWeight='bold' variant='title2'>
              {category.title}
            </Typography>
          }
        />
      </ListItemButton>
      {SubCategories.length > 0 && (
        <>
          <Divider />
          <Stack paddingInlineStart={7}>
            <List items={SubCategories} disablePadding />
          </Stack>
        </>
      )}
    </StyledListItem>
  )
}

export default CategoryListItem
