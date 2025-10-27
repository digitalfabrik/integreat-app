import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Skeleton, { SkeletonProps } from '@mui/material/Skeleton'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

const DEFAULT_LIST_ITEM_HEIGHT = 64

const StyledSkeletonBreadcrumb = styled(Skeleton)<SkeletonProps>`
  margin-top: 16px;
`

const StyledSkeletonHeader = styled(Skeleton)<SkeletonProps>`
  margin: 24px 0;
`

const StyledList = styled(List)`
  width: 100%;
`

const SkeletonText = styled(Skeleton)`
  width: ${({ width }) => width ?? '80%'};
  height: ${({ height }) => height ?? '24px'};
`

type ListSkeletonProps = {
  showBreadcrumbSkeleton?: boolean
  showHeaderSkeleton?: boolean
  showItemIcon?: boolean
  headerSize?: string
  showSkeletonAdditionalText?: boolean
  showSkeletonSearch?: boolean
}

const ListSkeleton = ({
  showBreadcrumbSkeleton = true,
  showHeaderSkeleton = true,
  showItemIcon = true,
  headerSize = '3rem',
  showSkeletonAdditionalText = false,
  showSkeletonSearch = false,
}: ListSkeletonProps): ReactElement => (
  <>
    {showBreadcrumbSkeleton && <StyledSkeletonBreadcrumb variant='text' component='span' width={180} height={30} />}
    {showHeaderSkeleton && (
      <StyledSkeletonHeader variant='text' component='h1' sx={{ fontSize: `${headerSize}` }} width={360} />
    )}
    {showSkeletonAdditionalText && <SkeletonText variant='text' width={260} sx={{ fontSize: '3rem' }} />}
    {showSkeletonSearch && <Skeleton variant='rectangular' width='80%' height={42} />}
    <StyledList>
      {Array.from({ length: 8 }).map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <ListItem key={index} disablePadding>
          {showItemIcon && (
            <ListItemIcon>
              <Skeleton variant='rectangular' width={42} height={42} />
            </ListItemIcon>
          )}
          <ListItemText primary={<SkeletonText variant='text' width='80%' height={64} />} />
        </ListItem>
      ))}
    </StyledList>
  </>
)

export default ListSkeleton
