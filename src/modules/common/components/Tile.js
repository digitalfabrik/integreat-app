// @flow

import * as React from 'react'

import styled from 'styled-components/native'
import { TouchableOpacity } from 'react-native'
import TileModel from '../models/TileModel'
import FastImage from 'react-native-fast-image'
import type { ThemeType } from '../../theme/constants/theme'
import getFastImageSource from '../getFastImageSource'

type PropsType = {
  tile: TileModel,
  onTilePress: (tile: TileModel) => void,
  theme: ThemeType
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
    const {tile, theme} = this.props
    const imageSource = getFastImageSource(tile.thumbnail)
    return <>
      <Thumbnail source={imageSource} resizeMode={FastImage.resizeMode.contain} />
      <TileTitle theme={theme}>{tile.title}</TileTitle>
    </>
  }

  onTilePress = () => {
    this.props.onTilePress(this.props.tile)
  }

  render () {
    return (
      <TileContainer>
        <TouchableOpacity onPress={this.onTilePress}>{this.getTileContent()}</TouchableOpacity>
      </TileContainer>
    )
  }
}

export default Tile
