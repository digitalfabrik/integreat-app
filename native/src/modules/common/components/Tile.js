// @flow

import * as React from 'react'

import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import { TouchableOpacity } from 'react-native'
import TileModel from '../models/TileModel'
import type { ThemeType } from '../../theme/constants'
import Image from './Image'

type PropsType = {
  tile: TileModel,
  onTilePress: (tile: TileModel) => void,
  theme: ThemeType
}

const ThumbnailContainer = styled(Image)`
  height: 150px;
`

const TileTitle: StyledComponent<{||}, ThemeType, *> = styled.Text`
  margin: 5px;
  color: ${props => props.theme.colors.textColor};
  text-align: center;
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
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

  render() {
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
