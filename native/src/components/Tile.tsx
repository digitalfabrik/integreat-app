import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { TileModel } from 'shared'

import useSnackbar from '../hooks/useSnackbar'
import openExternalUrl from '../utils/openExternalUrl'
import { reportError } from '../utils/sentry'
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
  language: string
}

const Tile = ({ onTilePress, tile, language }: TileProps): ReactElement => {
  const showSnackbar = useSnackbar()
  const openTile = () =>
    tile.isExternalUrl ? openExternalUrl(tile.path, showSnackbar).catch(reportError) : onTilePress(tile)

  return (
    <TileContainer onPress={openTile} role='link' accessibilityLanguage={language}>
      <Thumbnail source={tile.thumbnail} />
      <TileTitle android_hyphenationFrequency='full'>{tile.title}</TileTitle>
    </TileContainer>
  )
}

export default Tile
