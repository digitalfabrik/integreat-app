import React, { ReactElement } from 'react'
import { StyleSheet } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import { TileModel } from 'shared'

import useOpenExternalUrl from '../utils/openExternalUrl'
import ContrastImage from './ContrastImage'
import SimpleImage from './SimpleImage'
import Text from './base/Text'

const THUMBNAIL_HEIGHT = 150

const Thumbnail = styled(SimpleImage)`
  height: ${THUMBNAIL_HEIGHT}px;
  width: 150px;
  align-self: center;
`

type TileProps = {
  tile: TileModel
  onTilePress: (tile: TileModel) => void
  language: string
}

const styles = StyleSheet.create({
  tileContainer: {
    marginBottom: 20,
    width: '50%',
  },
})

const Tile = ({ onTilePress, tile, language }: TileProps): ReactElement => {
  const openExternalUrl = useOpenExternalUrl()
  const theme = useTheme()

  const thumbnail = <Thumbnail source={tile.thumbnail} />

  return (
    <TouchableRipple
      borderless
      onPress={() => (tile.isExternalUrl ? openExternalUrl(tile.path) : onTilePress(tile))}
      role='link'
      accessibilityLanguage={language}
      style={styles.tileContainer}>
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
    </TouchableRipple>
  )
}

export default Tile
