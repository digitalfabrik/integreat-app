import styled from '@emotion/styled'
import React, { ReactElement } from 'react'

import { TileModel } from 'shared'

import dimensions from '../constants/dimensions'
import Caption from './Caption'
import Tile from './Tile'

const TilesRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 10px 0;

  @media ${dimensions.mediumViewport} {
    grid-template-columns: repeat(3, 1fr);
  }

  @media ${dimensions.smallViewport} {
    grid-template-columns: repeat(2, 1fr);
  }
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
