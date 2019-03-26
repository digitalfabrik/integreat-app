// @flow

import React from 'react'

import Caption from 'modules/common/components/Caption'
import Tile from './Tile'

import styled from 'styled-components/native'
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
  justify-content: flex-start;
  padding: 10px 0;

`

const Wrapper = styled.View`

`

/**
 * Displays a table of Tiles
 */
class Tiles extends React.Component<PropsType> {
  render () {
    return (
      <>
        {this.props.title && <Caption title={this.props.title} />}
        <Wrapper>
          <TilesRow>
            {this.props.tiles.map(tile => <Tile key={tile.id} tile={tile} onTilePress={this.props.onTilePress} />)}
          </TilesRow>
        </Wrapper>
      </>
    )
  }
}

export default Tiles
