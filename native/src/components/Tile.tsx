import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import TileModel from '../models/TileModel'
import { PageResourceCacheStateType } from '../utils/DataContainer'
import SimpleImage from './SimpleImage'
import Pressable from './base/Pressable'

const Thumbnail = styled(SimpleImage)`
  height: 150px;
  width: 150px;
  align-self: center;
`

const TileTitle = styled.Text`
  margin: 5px;
  color: ${props => props.theme.colors.textColor};
  text-align: center;
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
`

const TileContainer = styled(Pressable)`
  margin-bottom: 20px;
  width: 50%;
`

type TileProps = {
  tile: TileModel
  onTilePress: (tile: TileModel) => void
  resourceCache: PageResourceCacheStateType | undefined
}

const Tile = ({ onTilePress, tile, resourceCache }: TileProps): ReactElement => (
  <TileContainer onPress={() => onTilePress(tile)}>
    <Thumbnail source={tile.thumbnail} resourceCache={resourceCache} />
    <TileTitle android_hyphenationFrequency='full'>{tile.title}</TileTitle>
  </TileContainer>
)

export default Tile
