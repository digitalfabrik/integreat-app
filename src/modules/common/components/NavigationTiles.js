// @flow

import React from 'react'

import styled from 'styled-components/native'
import TileModel from '../models/TileModel'
import type { ThemeType } from '../../theme/constants/theme'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import NavigationTile from './NavigationTile'
import { ScrollView, Dimensions } from 'react-native'
const SCREEN_WIDTH = Dimensions.get('window').width
const isWideScreen = SCREEN_WIDTH >= 375
const ANCHORS_WIDTH = isWideScreen ? 0 : 60
const SCROLL_VIEW_WIDTH = SCREEN_WIDTH - ANCHORS_WIDTH
const ITEM_WIDTH = isWideScreen
  ? SCROLL_VIEW_WIDTH / 4
  : SCROLL_VIEW_WIDTH / 3

type PropsType = {|
  tiles: TileModel[],
  theme: ThemeType
|}

const TilesRow = styled.View`
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  elevation: 1;
  shadow-color: #000000;
  shadow-opacity: 0.2;
  shadow-radius: 1px;
  shadow-offset: 1px;
`
const Icon = styled(MaterialIcon)`
  font-size: 30px;
  width: ${ANCHORS_WIDTH / 2}px;
`
/**
 * Displays a table of NavigationTiles
 */
class NavigationTiles extends React.Component<PropsType> {
  state = {
    xPosition: 0
  };

  ref_ = null;

  onRightAnchorPress = () => {
    const { xPosition } = this.state
    if (!xPosition) {
      this.ref_.scrollToEnd({ animated: true })
    } else {
      this.ref_.scrollTo({ y: 0, x: xPosition - ITEM_WIDTH, animated: true })
    }
  };

  onLeftAnchorPress = () => {
    const { xPosition } = this.state
    if (!xPosition) {
      this.ref_.scrollToEnd({ animated: true })
    } else {
      this.ref_.scrollTo({ y: 0, x: xPosition - ITEM_WIDTH, animated: true })
    }
  };

  setRef = ref => {
    this.ref_ = ref
  };

  onMomentumScrollEnd = ({ nativeEvent }) => {
    this.setState({ xPosition: nativeEvent.contentOffset.x })
  };

  render () {
    const { tiles, theme } = this.props

    return (
      <TilesRow theme={theme}>
        {!isWideScreen && (
          <Icon
            name='keyboard-arrow-left'
            color={theme.colors.black}
            onPress={this.onRightAnchorPress}
          />
        )}
        <ScrollView
          horizontal
          ref={this.setRef}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}
          style={{ width: SCROLL_VIEW_WIDTH }}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          snapToInterval={ITEM_WIDTH}
          decelerationRate='fast'
          bounces={false}
          onMomentumScrollEnd={this.onMomentumScrollEnd}
          snapToAlignment='center'>
          {tiles.map(tile => (
            <NavigationTile
              key={tile.path}
              tile={tile}
              theme={theme}
              width={ITEM_WIDTH}
            />
          ))}
        </ScrollView>
        {!isWideScreen && (
          <Icon
            name='keyboard-arrow-right'
            color={theme.colors.black}
            onPress={this.onLeftAnchorPress}
          />
        )}
      </TilesRow>
    )
  }
}

export default NavigationTiles
