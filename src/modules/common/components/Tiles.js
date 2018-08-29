// @flow

import React from 'react'

import Caption from 'modules/common/components/Caption'
import Tile from './Tile'

import styled from 'styled-components'
import TileModel from '../models/TileModel'

type PropsType = {
  title: ?string,
  tiles: TileModel[],
  onTilePress: (tile: TileModel) => void
}

const TilesRow = styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
`

/**
 * Displays a table of Tiles
 */
class Tiles extends React.Component<PropsType> {
  render () {
    return (
      <>
        {this.props.title && <Caption title={this.props.title} />}
        <TilesRow>
          {this.props.tiles.map(tile => <Tile key={tile.id} tile={tile} onTilePress={this.props.onTilePress} />)}
        </TilesRow>
      </>
    )
  }
}

export default Tiles
