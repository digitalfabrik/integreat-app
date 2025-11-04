import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Skeleton from '@mui/material/Skeleton'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

const NUM_SKELETONS = 8
const ICON_WIDTH = 40
const ICON_HEIGHT = 40
const LIST_ITEM_HEIGHT = 64

const StyledList = styled(List)`
  width: 100%;
`

const StyledListItem = styled(ListItem)`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  gap: 8px;
`

const SkeletonText = styled(Skeleton)`
  width: ${({ width }) => width ?? '80%'};
  height: ${({ height }) => height ?? '40px'};
`

type ListSkeletonProps = {
  showItemIcon?: boolean
  iconWidth?: number
  iconHeight?: number
  listItemIcon?: ReactElement
  listItemHeight?: number
}

const SkeletonList = ({ listItemIcon, listItemHeight = LIST_ITEM_HEIGHT }: ListSkeletonProps): ReactElement => (
  <StyledList disablePadding>
    {[...Array(NUM_SKELETONS).keys()].map(index => (
      <StyledListItem key={index} disablePadding divider>
        {listItemIcon && (
          <ListItemIcon>
            <Skeleton variant='rectangular'>{listItemIcon}</Skeleton>
          </ListItemIcon>
        )}
        <ListItemText primary={<SkeletonText variant='text' width='100%' height={listItemHeight} />} />
      </StyledListItem>
    ))}
  </StyledList>
)

export default SkeletonList
