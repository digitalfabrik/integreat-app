import * as React from 'react'
import { ReactNode } from 'react'
import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import { ThemeType } from 'build-configs'

import TileModel from '../models/TileModel'
import SimpleImage from './SimpleImage'

type PropsType = {
  tile: TileModel
  onTilePress: (tile: TileModel) => void
  theme: ThemeType
}
const ThumbnailContainer = styled(SimpleImage)`
  height: 150px;
`
const TileTitle = styled.Text`
  margin: 5px;
  color: ${props => props.theme.colors.textColor};
  text-align: center;
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
`
const TileContainer = styled.View`
  margin-bottom: 20px;
  width: 50%;
`

/**
 * Displays a single Tile
 */
class Tile extends React.Component<PropsType> {
  onTilePress = (): void => {
    const { onTilePress, tile } = this.props
    onTilePress(tile)
  }

  render(): ReactNode {
    const { tile, theme } = this.props

    return (
      <TileContainer>
        <TouchableOpacity onPress={this.onTilePress}>
          <ThumbnailContainer source={tile.thumbnail} />
          <TileTitle theme={theme}>{tile.title}</TileTitle>
        </TouchableOpacity>
      </TileContainer>
    )
  }
}

export default Tile
