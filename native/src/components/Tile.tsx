import React, { ReactElement } from 'react'
import { TouchableRipple } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import { TileModel } from 'shared'

import useOpenExternalUrl from '../utils/openExternalUrl'
import ContrastImage from './ContrastImage'
import SimpleImage from './SimpleImage'
import Text from './base/Text'

const THUMBNAIL_HEIGHT = 150
const MIN_TILE_WIDTH = 180
const MIN_COLUMNS = 2
const MAX_COLUMNS = 4
const FULL_WIDTH_PERCENT = 100

const Thumbnail = styled(SimpleImage)`
  height: ${THUMBNAIL_HEIGHT}px;
  width: 150px;
  align-self: center;
`

const TileContainer = styled(TouchableRipple)`
  flex-grow: 1;
  flex-basis: ${MIN_TILE_WIDTH}px;
  min-width: ${FULL_WIDTH_PERCENT / MAX_COLUMNS}%;
  max-width: ${FULL_WIDTH_PERCENT / MIN_COLUMNS}%;
  margin-bottom: 20px;
`

type TileProps = {
  tile: TileModel
  onTilePress: (tile: TileModel) => void
  language: string
}

const Tile = ({ onTilePress, tile, language }: TileProps): ReactElement => {
  const openExternalUrl = useOpenExternalUrl()
  const theme = useTheme()

  const thumbnail = <Thumbnail source={tile.thumbnail} />

  return (
    <TileContainer
      borderless
      onPress={() => (tile.isExternalUrl ? openExternalUrl(tile.path) : onTilePress(tile))}
      role='link'
      accessibilityLanguage={language}>
      <>
        {theme.dark ? <ContrastImage>{thumbnail}</ContrastImage> : thumbnail}
        <Text
          variant='body2'
          style={{
            margin: 4,
            textAlign: 'center',
          }}
          android_hyphenationFrequency='full'>
          {tile.title}
        </Text>
      </>
    </TileContainer>
  )
}

export default Tile
