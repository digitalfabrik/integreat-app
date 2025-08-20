import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import { TileModel } from 'shared'

import Caption from './Caption'
import Tile from './Tile'

const TilesRow = styled('div')`
  display: grid;

  /* https://css-tricks.com/intrinsically-responsive-css-grid-with-minmax-and-min/ */
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  padding: 10px 0;
`

type TilesProps = {
  title: string | null
  tiles: TileModel[]
}

const Tiles = ({ title, tiles }: TilesProps): ReactElement => (
  <div>
    {!!title && <Caption title={title} />}
    <TilesRow>
      {tiles.map(tile => (
        <Tile key={tile.path} tile={tile} />
      ))}
    </TilesRow>
  </div>
)

export default Tiles
