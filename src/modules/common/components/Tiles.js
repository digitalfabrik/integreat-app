// @flow

import React from 'react'

import Caption from 'modules/common/components/Caption'
import Tile from './Tile'

import styled from 'styled-components'
import TileModel from '../models/TileModel'
import { View } from 'react-native'

type PropsType = {
  title: ?string,
  tiles: TileModel[]
}

const TilesRow = styled.View`
  padding: 10px 0;
`

/**
 * Displays a table of Tiles
 */
class Tiles extends React.Component<PropsType> {
  render () {
    return (
      <View>
        {this.props.title && <Caption title={this.props.title} />}
        <TilesRow>
          {this.props.tiles.map(tile => <Tile key={tile.id} tile={tile} />)}
        </TilesRow>
      </View>
    )
  }
}

export default Tiles
