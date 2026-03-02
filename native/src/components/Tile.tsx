import React, { ReactElement } from 'react'
import { StyleSheet } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import { TileModel } from 'shared'

import useSnackbar from '../hooks/useSnackbar'
import openExternalUrl from '../utils/openExternalUrl'
import { reportError } from '../utils/sentry'
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
  const showSnackbar = useSnackbar()
  const theme = useTheme()
  const isContrastTheme = theme.legacy.isContrastTheme
  const openTile = () =>
    tile.isExternalUrl ? openExternalUrl(tile.path, showSnackbar).catch(reportError) : onTilePress(tile)

  const thumbnail = <Thumbnail source={tile.thumbnail} />

  return (
    <TouchableRipple
      borderless
      onPress={openTile}
      role='link'
      accessibilityLanguage={language}
      style={styles.tileContainer}>
      <>
        {isContrastTheme ? <ContrastImage>{thumbnail}</ContrastImage> : thumbnail}
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
