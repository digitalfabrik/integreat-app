import Skeleton, { SkeletonProps } from '@mui/material/Skeleton'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

const DEFAULT_HEADER_HEIGHT = 60
const DEFAULT_HEADER_WIDTH = '70%'

const StyledSkeletonHeader = styled(Skeleton)<SkeletonProps>`
  margin: 24px 0;
`

type SkeletonHeaderProps = {
  width?: number | string
}

const SkeletonHeader = ({ width = DEFAULT_HEADER_WIDTH }: SkeletonHeaderProps): ReactElement => (
  <StyledSkeletonHeader variant='text' component='h1' height={DEFAULT_HEADER_HEIGHT} width={width} />
)

export default SkeletonHeader
