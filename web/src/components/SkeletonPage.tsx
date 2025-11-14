import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import React, { ReactElement } from 'react'

import SkeletonHeader from './SkeletonHeader'

const NUM_SKELETONS = 12
const MIN_WIDTH = 60
const MAX_WIDTH = 90

const SkeletonPage = (): ReactElement => (
  <Stack direction='column' width='100%'>
    <SkeletonHeader />
    {[...Array(NUM_SKELETONS).keys()].map(index => {
      const width = `${MIN_WIDTH + Math.random() * (MAX_WIDTH - MIN_WIDTH)}%`
      return <Skeleton key={index} variant='text' width={width} height={30} />
    })}
    <Skeleton variant='text' width='30%' height={20} />
  </Stack>
)

export default SkeletonPage
