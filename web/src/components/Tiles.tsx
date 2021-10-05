import React, { ReactElement } from 'react'
import { Row } from 'react-styled-flexboxgrid'
import styled from 'styled-components'

import TileModel from '../models/TileModel'
import Caption from './Caption'
import Tile from './Tile'

type PropsType = {
  title: string | null
  tiles: Array<TileModel>
}

const TilesRow = styled(Row)`
  padding: 10px 0;
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
