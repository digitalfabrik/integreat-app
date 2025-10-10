import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import { TileModel } from 'shared'

import Caption from './Caption'
import Tile from './Tile'

const Grid = styled('div')`
  display: grid;

  /* https://css-tricks.com/intrinsically-responsive-css-grid-with-minmax-and-min/ */
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 32px 24px;
  justify-items: center;

  ${props => props.theme.breakpoints.down('md')} {
    gap: 8px;
  }
`

type TilesProps = {
  title: string | null
  tiles: TileModel[]
}

const Tiles = ({ title, tiles }: TilesProps): ReactElement => (
  <Stack paddingTop={2} alignContent='center'>
    {!!title && <Caption title={title} />}
    <Grid>
      {tiles.map(tile => (
        <Tile key={tile.path} tile={tile} />
      ))}
    </Grid>
  </Stack>
)

export default Tiles
