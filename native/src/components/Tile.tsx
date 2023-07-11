import React, { ReactElement } from 'react'
import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import TileModel from '../models/TileModel'
import SimpleImage from './SimpleImage'

type TileProps = {
  tile: TileModel
  onTilePress: (tile: TileModel) => void
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

const Tile = ({ onTilePress, tile }: TileProps): ReactElement => (
  <TileContainer>
    <TouchableOpacity onPress={() => onTilePress(tile)}>
      {!tile.thumbnail || typeof tile.thumbnail === 'string' ? (
        <ThumbnailContainer source={tile.thumbnail} />
      ) : (
        <tile.thumbnail height={150} />
      )}
      <TileTitle android_hyphenationFrequency='full'>{tile.title}</TileTitle>
    </TouchableOpacity>
  </TileContainer>
)

export default Tile
