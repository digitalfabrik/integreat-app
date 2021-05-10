import * as React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'
import { StyledComponent } from 'styled-components'
import 'styled-components'
import TileModel from '../models/TileModel'
import { ThemeType } from '../../theme/constants'
import Image from './Image'
const NEWS_DOT_RADIUS = 20
const ICON_SIZE = 50
type PropsType = {
  tile: TileModel
  theme: ThemeType
  width: number
}
const Circle = styled(View)`
  margin-top: 9px;
  margin-bottom: 5px;
  border-radius: ${ICON_SIZE}px;
  height: ${ICON_SIZE}px;
  width: ${ICON_SIZE}px;
  background-color: ${props => props.theme.colors.backgroundColor};
  align-items: center;
  justify-content: center;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.2;
  shadow-radius: 1.41px;
`
const ThumbnailContainer = styled(Image)`
  height: ${ICON_SIZE / Math.sqrt(2)}px;
  width: ${ICON_SIZE / Math.sqrt(2)}px;
`
const TileTitle = styled.Text`
  color: ${props => props.theme.colors.textColor};
  text-align: center;
  font-size: 11px;
  margin-bottom: 5px;
`
const TileTouchable: StyledComponent<
  {
    width: number
  },
  {},
  any
> = styled.TouchableOpacity`
  padding: 10px 3px;
  width: ${props => props.width}px;
  align-items: center;
`
const NewsDot = styled.Text`
  position: absolute;
  top: ${-NEWS_DOT_RADIUS / 2};
  end: ${-NEWS_DOT_RADIUS / 2};
  text-align: center;
  line-height: ${NEWS_DOT_RADIUS}px;
  height: ${NEWS_DOT_RADIUS}px;
  width: ${NEWS_DOT_RADIUS}px;
  border-radius: ${NEWS_DOT_RADIUS / 2}px;
  background-color: #ee5353;
  color: #ffffff;
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
  getNewsDot(): React.ReactNode {
    const notifications = this.props.tile.notifications

    if (notifications && notifications > 0) {
      return <NewsDot theme={this.props.theme}>{notifications}</NewsDot>
    } else {
      return null
    }
  }

  getTileContent(): React.ReactNode {
    const { tile, theme } = this.props
    return (
      <>
        <Circle theme={theme}>
          <ThumbnailContainer source={tile.thumbnail} />
          {this.getNewsDot()}
        </Circle>
        <TileTitle theme={theme}>{tile.title}</TileTitle>
      </>
    )
  }

  render() {
    const { tile, theme, width } = this.props
    return (
      <TileTouchable theme={theme} onPress={tile.onTilePress} width={width}>
        {this.getTileContent()}
      </TileTouchable>
    )
  }
}

export default NavigationTile
