// @flow

import * as React from 'react'
import { View } from 'react-native'
import styled, { type StyledComponent } from 'styled-components/native'
import TileModel from '../models/TileModel'
import FastImage from 'react-native-fast-image'
import type { ThemeType } from '../../theme/constants/theme'
import getFastImageSource from '../getFastImageSource'

const NEWS_DOT_RADIUS = 20
const ICON_SIZE = 50

type PropsType = {|
  tile: TileModel,
  theme: ThemeType
|}

const Circle = styled(View)`
  margin-top: 9px;
  margin-bottom: 5px;
  border-radius: ${ICON_SIZE}px;
  height: ${ICON_SIZE};
  width: ${ICON_SIZE};
  background-color: ${props => props.theme.colors.backgroundColor};
  align-items: center;
  justify-content: center;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.2;
  shadow-radius: 1.41px;
`

const Thumbnail = styled(FastImage)`
  height: ${ICON_SIZE / Math.sqrt(2)};
  width: ${ICON_SIZE / Math.sqrt(2)};
`

const TileTitle = styled.Text`
  color: ${props => props.theme.colors.textColor};
  text-align: center;
  font-size: 11;
  margin-bottom: 5px;
`

const TileTouchable: StyledComponent<{}, {}, *> = styled.TouchableOpacity`
  padding: 10px 0;
  flex: 1;
  align-items: center;
`

const NewsDot = styled.Text`
  position: absolute;
  top: ${-NEWS_DOT_RADIUS / 2};
  end: ${-NEWS_DOT_RADIUS / 2};
  text-align: center;
  line-height: ${NEWS_DOT_RADIUS};
  height: ${NEWS_DOT_RADIUS};
  width: ${NEWS_DOT_RADIUS};
  border-radius: ${NEWS_DOT_RADIUS / 2};
  background-color: #EE5353;
  color: #FFFFFF;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`

/**
 * Displays a single NavigationTile
 */
class NavigationTile extends React.Component<PropsType> {
  getNewsDot (): React.Node {
    const notifications = this.props.tile.notifications
    if (notifications && notifications > 0) {
      return <NewsDot theme={this.props.theme}>{notifications}</NewsDot>
    } else {
      return null
    }
  }

  getTileContent (): React.Node {
    const {tile, theme} = this.props
    const imageSource = getFastImageSource(tile.thumbnail)
    return <>
      <Circle theme={theme}>
        <Thumbnail source={imageSource} resizeMode={FastImage.resizeMode.contain} />
        {this.getNewsDot()}
      </Circle>
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

export default NavigationTile
