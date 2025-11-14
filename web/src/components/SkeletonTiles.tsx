import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import React, { ReactElement } from 'react'

import SkeletonHeader from './SkeletonHeader'
import { StyledButton } from './Tile'
import { Grid } from './Tiles'

const NUM_TILES_SKELETON = 8

const SkeletonTiles = (): ReactElement => (
  <Stack paddingTop={2} alignContent='center'>
    <Stack alignItems='center'>
      <SkeletonHeader />
    </Stack>
    <Grid>
      {[...Array(NUM_TILES_SKELETON).keys()].map(index => (
        <StyledButton key={index}>
          <Skeleton variant='rectangular' width='100%' height={150} />
          <Skeleton variant='text' component='p' width='100%' />
        </StyledButton>
      ))}
    </Grid>
  </Stack>
)

export default SkeletonTiles
