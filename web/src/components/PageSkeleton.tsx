import Box from '@mui/material/Box'
import Skeleton, { SkeletonProps } from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

const StyledSkeletonBreadcrumb = styled(Skeleton)<SkeletonProps>`
  margin-top: 16px;
`

const StyledStack = styled(Stack)`
  width: 100%;
`

const StyledBox = styled(Box)`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const MIN_WIDTH = 60
const MAX_WIDTH = 90
const randomWidth = `${MIN_WIDTH + Math.random() * (MAX_WIDTH - MIN_WIDTH)}%`

type PageSkeletonProps = {
  showHeaderSkeleton?: boolean
}

const PageSkeleton = ({ showHeaderSkeleton = true }: PageSkeletonProps): ReactElement => (
  <StyledStack direction='column' spacing={2}>
    {showHeaderSkeleton && <StyledSkeletonBreadcrumb variant='text' component='span' width={180} height={30} />}
    <Skeleton variant='text' component='h1' width='70%' height={60} />

    <StyledBox>
      <Skeleton variant='text' width='80%' height={20} />
      <Skeleton variant='text' width='70%' height={20} />
    </StyledBox>

    <StyledBox>
      {Array.from({ length: 12 }).map((_, index) => (
        <Skeleton
          /* eslint-disable-next-line react/no-array-index-key */
          key={index}
          variant='text'
          width={randomWidth}
          height={30}
        />
      ))}
    </StyledBox>
    <Skeleton variant='text' width='30%' height={20} />
  </StyledStack>
)

export default PageSkeleton
