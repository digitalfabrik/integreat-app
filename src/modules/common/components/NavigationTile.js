// @flow

import * as React from 'react'

import styled from 'styled-components/native'
import TileModel from '../models/TileModel'
import FastImage from 'react-native-fast-image'
import type { ThemeType } from '../../theme/constants/theme'

const NEWS_DOT_RADIUS = 20
const TILE_LENGTH = 100
const ICON_LENGTH = 50

type PropsType = {|
  tile: TileModel,
  theme: ThemeType
|}

const Thumbnail = styled(FastImage)`
  margin: 12px 0;
  height: ${ICON_LENGTH}px;
  width: ${ICON_LENGTH}px;
`

const TileTitle = styled.Text`
  color: ${props => props.theme.colors.textColor};
  text-align: center;
`

// FIXME when testing on ios
const TileTouchable = styled.TouchableOpacity`
  height: ${TILE_LENGTH}px;
  width: ${TILE_LENGTH}px;
  align-items: center;
  border-radius: 5px;
  margin-bottom: 20px;
  background-color: ${props => props.theme.colors.backgroundColor};
  /** shadow-offset: {width: 0, height: 2}; FIXME when testing on ios **/
  shadow-opacity: 0.8;
  shadow-radius: 2;
  shadow-color: #000000;
  elevation: 6;
`

const NewsDot = styled.Text`
  position: absolute;
  top: ${-NEWS_DOT_RADIUS / 2 + 2};
  right: ${-NEWS_DOT_RADIUS / 2 + 2};
  text-align: center;
  line-height: ${NEWS_DOT_RADIUS};
  height: ${NEWS_DOT_RADIUS};
  width: ${NEWS_DOT_RADIUS};
  border-radius: ${NEWS_DOT_RADIUS / 2};
  background-color: #EE5353;
  color: #FFFFFF;
  elevation: 5;
`

/**
 * Displays a single Tile
 */
class Tile extends React.Component<PropsType> {
  getNewsDot (): React.Node {
    const notifications = this.props.tile.notifications
    if (notifications && notifications > 0) {
      return <NewsDot>{notifications}</NewsDot>
    } else {
      return null
    }
  }

  getTileContent (): React.Node {
    const {tile, theme} = this.props
    const imageSource = typeof tile.thumbnail === 'number' ? tile.thumbnail : {
      uri: tile.thumbnail,
      priority: FastImage.priority.normal,
      // disable caching, we want to do it manually
      headers: {'Cache-Control': 'no-cache, no-store, must-revalidate'},
      cache: FastImage.cacheControl.web
    }
    return <>
      <Thumbnail theme={theme} source={imageSource} resizeMode={FastImage.resizeMode.contain} />
      {this.getNewsDot()}
      <TileTitle theme={theme}>{tile.title}</TileTitle>
    </>
  }

  render () {
    const {tile, theme} = this.props
    return (
      <TileTouchable theme={theme} onPress={tile.onTilePress}>
        {this.getTileContent()}
      </TileTouchable>
    )
  }
}

export default Tile
