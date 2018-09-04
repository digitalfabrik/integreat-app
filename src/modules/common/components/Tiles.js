// @flow

import React from 'react'

import Caption from 'modules/common/components/Caption'
import Tile from './Tile'
import { Row } from 'react-styled-flexboxgrid'

import styled from 'styled-components'
import TileModel from '../models/TileModel'

type PropsType = {
  title: ?string,
  tiles: TileModel[]
}

const TilesRow = styled(Row)`
  padding: 10px 0;
`

/**
 * Displays a table of Tiles
 */
class Tiles extends React.Component<PropsType> {
  render () {
    return (
      <div>
        {this.props.title && <Caption title={this.props.title} />}
        <TilesRow>
          {this.props.tiles.map(tile => <Tile key={tile.id} tile={tile} />)}
        </TilesRow>
      </div>
    )
  }
}

export default Tiles
