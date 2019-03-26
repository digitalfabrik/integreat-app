// @flow

import * as React from 'react'

import styled from 'styled-components/native'
import { TouchableOpacity } from 'react-native'
import TileModel from '../models/TileModel'
import FastImage from 'react-native-fast-image'
import type { ThemeType } from '../../theme/constants/theme'

const NEWS_DOT_RADIUS = 20
const TILE_LENGHT = 85

type PropsType = {|
  tile: TileModel,
  theme: ThemeType,
  widthPercentage: number
|}

// FIXME when testing on ios
const Thumbnail = styled(FastImage)`
  border-radius: 5px;
  height: ${TILE_LENGHT}px;
  width: ${TILE_LENGHT}px;
  background-color: ${props => props.theme.colors.backgroundColor};
  /** shadow-offset: {width: 0, height: 2}; FIXME when testing on ios **/
  shadow-opacity: 0.8;
  shadow-radius: 2;
  shadow-color: #000000;
  elevation: 8;
`

const TileTitle = styled.Text`
  margin: 5px 0;
  color: ${props => props.theme.colors.textColor};
  text-align: center;
`

const TileContainer = styled.View`
  align-items: center;
  margin-bottom: 20px;
  width: ${props => props.widthPercentage}%;
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
  elevation: 9;
`

/**
 * Displays a single Tile
 */
class Tile extends React.Component<PropsType> {
  getNewsDot (): React.Node {
    const news = this.props.tile.news
    if (news && news > 0) {
      return <NewsDot>{news}</NewsDot>
    } else {
      return null
    }
  }

  getTileContent (): React.Node {
    const {tile, height, theme} = this.props
    const imageSource = {
      uri: tile.thumbnail,
      priority: FastImage.priority.normal,
      // disable caching, we want to do it manually
      headers: {'Cache-Control': 'no-cache, no-store, must-revalidate'},
      cache: FastImage.cacheControl.web
    }
    return <>
      <Thumbnail theme={theme} source={imageSource} resizeMode={FastImage.resizeMode.contain} height={height} />
      <TileTitle theme={theme}>{tile.title}</TileTitle>
      {this.getNewsDot()}
    </>
  }

  render () {
    const {widthPercentage, tile} = this.props
    return (
      <TileContainer widthPercentage={widthPercentage}>
          <TouchableOpacity onPress={tile._onTilePress}>{this.getTileContent()}</TouchableOpacity>
      </TileContainer>
    )
  }
}

export default Tile
