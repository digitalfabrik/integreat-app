import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { TileModel } from 'shared'

import useSnackbar from '../hooks/useSnackbar'
import openExternalUrl from '../utils/openExternalUrl'
import { reportError } from '../utils/sentry'
import SimpleImage from './SimpleImage'
import Pressable from './base/Pressable'
import Text from './base/Text'

const Thumbnail = styled(SimpleImage)`
  height: 150px;
  width: 150px;
  align-self: center;
`

const TileContainer = styled(Pressable)`
  margin-bottom: 20px;
  width: 50%;
`

type TileProps = {
  tile: TileModel
  onTilePress: (tile: TileModel) => void
  language: string
}

const Tile = ({ onTilePress, tile, language }: TileProps): ReactElement => {
  const showSnackbar = useSnackbar()
  const openTile = () =>
    tile.isExternalUrl ? openExternalUrl(tile.path, showSnackbar).catch(reportError) : onTilePress(tile)

  return (
    <TileContainer onPress={openTile} role='link' accessibilityLanguage={language}>
      <Thumbnail source={tile.thumbnail} />
      <Text
        variant='body2'
        style={{
          margin: 4,
          textAlign: 'center',
        }}
        android_hyphenationFrequency='full'>
        {tile.title}
      </Text>
    </TileContainer>
  )
}

export default Tile
