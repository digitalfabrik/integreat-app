import React, { ReactNode } from 'react'
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
class Tiles extends React.PureComponent<PropsType> {
  render(): ReactNode {
    return (
      <div>
        {this.props.title && <Caption title={this.props.title} />}
        <TilesRow>
          {this.props.tiles.map(tile => (
            <Tile key={tile.path} tile={tile} />
          ))}
        </TilesRow>
      </div>
    )
  }
}

export default Tiles
