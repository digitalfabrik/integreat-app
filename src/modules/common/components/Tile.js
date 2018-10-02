// @flow

import * as React from 'react'

import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'
import TileModel from '../models/TileModel'
import FastImage from 'react-native-fast-image'

type PropsType = {
  tile: TileModel,
  onTilePress: (tile: TileModel) => void
}

const Thumbnail = styled(FastImage)`
  height: 150px;
`

const TileTitle = styled.Text`
  margin: 5px 0;
  color: ${props => props.theme.colors.textColor};
  text-align: center;
`

const TileContainer = styled.View`
  margin-bottom: 20px;
  width: 50%;
`

/**
 * Displays a single Tile
 */
class Tile extends React.Component<PropsType> {
  getTileContent (): React.Node {
    return <>
      <Thumbnail source={{uri: this.props.tile.thumbnail}} resizeMode={FastImage.resizeMode.contain} />
      <TileTitle>{this.props.tile.title}</TileTitle>
    </>
  }

  onTilePress = () => {
    this.props.onTilePress(this.props.tile)
  }

  getTile (): React.Node {
    const tile = this.props.tile
    if (!tile.isExternalUrl) {
      return <TouchableOpacity onPress={this.onTilePress}>{this.getTileContent()}</TouchableOpacity>
    }
  }

  render () {
    return (
      <TileContainer>
        {this.getTile()}
      </TileContainer>
    )
  }
}

export default Tile
