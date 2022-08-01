import React, { ReactElement } from 'react'
import styled from 'styled-components'

import dimensions from '../constants/dimensions'
import TileModel from '../models/TileModel'
import Caption from './Caption'
import Tile from './Tile'

type PropsType = {
  title: string | null
  tiles: Array<TileModel>
}

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

/**
 * Displays a table of Tiles
 */
const Tiles = ({ title, tiles }: PropsType): ReactElement => (
  <div>
    {title && <Caption title={title} />}
    <TilesRow>
      {tiles.map(tile => (
        <Tile key={tile.path} tile={tile} />
      ))}
    </TilesRow>
  </div>
)

export default Tiles
