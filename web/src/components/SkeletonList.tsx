import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Skeleton from '@mui/material/Skeleton'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

const NUM_SKELETON_LIST_ITEMS = 8
const LIST_ITEM_HEIGHT = 64

const StyledList = styled(List)`
  width: 100%;
`

const StyledListItem = styled(ListItem)`
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  gap: 12px;
`

const SkeletonText = styled(Skeleton)`
  width: ${({ width }) => width ?? '80%'};
  height: ${({ height }) => height ?? '40px'};
`

type ListSkeletonProps = {
  listItemIcon?: ReactElement
  listItemHeight?: number
}

const SkeletonList = ({ listItemIcon, listItemHeight = LIST_ITEM_HEIGHT }: ListSkeletonProps): ReactElement => (
  <StyledList disablePadding>
    {[...Array(NUM_SKELETON_LIST_ITEMS).keys()].map(index => (
      <StyledListItem key={index} divider>
        {listItemIcon && (
          <ListItemIcon>
            <Skeleton variant='rectangular'>{listItemIcon}</Skeleton>
          </ListItemIcon>
        )}
        <ListItemText primary={<SkeletonText variant='rectangular' width='100%' height={listItemHeight} />} />
      </StyledListItem>
    ))}
  </StyledList>
)

export default SkeletonList
