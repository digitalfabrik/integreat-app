// @flow

import * as React from 'react'

import styled, { type StyledComponent } from 'styled-components/native'
import { TouchableOpacity } from 'react-native'
import TileModel from '../models/TileModel'
import type { ThemeType } from '../../theme/constants/theme'
import Thumbnail from './Thumbnail'

type PropsType = {
  tile: TileModel,
  onTilePress: (tile: TileModel) => void,
  theme: ThemeType
}

const ThumbnailContainer = styled(Thumbnail)`
  height: 150px;
`

const TileTitle = styled.Text`
  margin: 5px 0;
  color: ${props => props.theme.colors.textColor};
  text-align: center;
  font-family: ${props => props.theme.fonts.decorativeFontRegular};
`

const TileContainer: StyledComponent<{}, {}, *> = styled.View`
  margin-bottom: 20px;
  width: 50%;
`

/**
 * Displays a single Tile
 */
class Tile extends React.Component<PropsType> {
  onTilePress = () => {
    this.props.onTilePress(this.props.tile)
  }

  render () {
    const {tile, theme} = this.props

    return (
      <TileContainer>
        <TouchableOpacity onPress={this.onTilePress}>
          <ThumbnailContainer uri={tile.thumbnail} />
          <TileTitle theme={theme}>{tile.title}</TileTitle>
        </TouchableOpacity>
      </TileContainer>
    )
  }
}

export default Tile
