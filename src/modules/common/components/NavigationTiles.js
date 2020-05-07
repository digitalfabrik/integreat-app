// @flow

import React from 'react'

import styled from 'styled-components/native'
import TileModel from '../models/TileModel'
import type { ThemeType } from '../../theme/constants/theme'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import NavigationTile from './NavigationTile'
import { ScrollView } from 'react-native'
import OnLayout from 'react-native-on-layout'
const WIDTH_BREAK_POINT = 375
const ANCHOR_INITIAL_WIDTH = 60
const WIDE_SCREEN_ITEMS_COUNT = 4
const SMALL_SCREEN_ITEMS_COUNT = 3

type PropsType = {|
  tiles: TileModel[],
  theme: ThemeType,
  navigationItemWidth: number,
  isWideScreen: boolean,
  scrollViewWidth: number,
  anchorWidth: number
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
  width: ${props => props.width / 2}px;
`
/**
 * Displays a table of NavigationTiles
 */
class NavigationTiles extends React.Component<
  PropsType,
  { xPosition: number }
> {
  state = {
    xPosition: 0
  };

  ref_ = null;

  onRightAnchorPress = () => {
    const { navigationItemWidth } = this.props
    const { xPosition } = this.state

    if (!xPosition) {
      this.ref_ && this.ref_.scrollToEnd({ animated: true })
    } else {
      this.ref_ && this.ref_.scrollTo({
        y: 0,
        x: xPosition - navigationItemWidth,
        animated: true
      })
    }
  };

  onLeftAnchorPress = () => {
    const { navigationItemWidth } = this.props
    const { xPosition } = this.state

    if (!xPosition) {
      this.ref_ && this.ref_.scrollToEnd({ animated: true })
    } else {
      this.ref_ && this.ref_.scrollTo({
        y: 0,
        x: xPosition - navigationItemWidth,
        animated: true
      })
    }
  };

  setRef = ref => {
    this.ref_ = ref
  };

  onMomentumScrollEnd = ({ nativeEvent }) => {
    this.setState({ xPosition: nativeEvent.contentOffset.x })
  };

  render () {
    const {
      tiles,
      theme,
      isWideScreen,
      navigationItemWidth,
      scrollViewWidth,
      anchorWidth
    } = this.props
    const isMoreThanThreeItems = tiles.length > SMALL_SCREEN_ITEMS_COUNT

    return (
      <TilesRow theme={theme}>
        {!isWideScreen && isMoreThanThreeItems && (
          <Icon
            name='keyboard-arrow-left'
            color={theme.colors.black}
            onPress={this.onRightAnchorPress}
            width={anchorWidth}
          />
        )}
        <ScrollView
          horizontal
          ref={this.setRef}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'space-between'
          }}
          style={{ width: scrollViewWidth }}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          snapToInterval={navigationItemWidth}
          decelerationRate='fast'
          bounces={false}
          onMomentumScrollEnd={this.onMomentumScrollEnd}
          snapToAlignment='center'>
          {tiles.map(tile => (
            <NavigationTile
              key={tile.path}
              tile={tile}
              theme={theme}
              width={navigationItemWidth}
            />
          ))}
        </ScrollView>
        {!isWideScreen && isMoreThanThreeItems && (
          <Icon
            name='keyboard-arrow-right'
            color={theme.colors.black}
            onPress={this.onLeftAnchorPress}
            width={anchorWidth}
          />
        )}
      </TilesRow>
    )
  }
}

const NavigationTilesWithScrollableView = props => (
  <OnLayout>
    {({ width }) => {
      const isWideScreen = width >= WIDTH_BREAK_POINT
      const ANCHORS_WIDTH = isWideScreen ? 0 : ANCHOR_INITIAL_WIDTH
      const SCROLL_VIEW_WIDTH = width - ANCHORS_WIDTH
      const ITEM_WIDTH = isWideScreen
        ? SCROLL_VIEW_WIDTH / WIDE_SCREEN_ITEMS_COUNT
        : SCROLL_VIEW_WIDTH / SMALL_SCREEN_ITEMS_COUNT

      return (
        <NavigationTiles
          navigationItemWidth={ITEM_WIDTH}
          isWideScreen={isWideScreen}
          scrollViewWidth={SCROLL_VIEW_WIDTH}
          anchorWidth={ANCHORS_WIDTH}
          {...props}
        />
      )
    }}
  </OnLayout>
)

export default NavigationTilesWithScrollableView
