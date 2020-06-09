// @flow

import React from 'react'
import type { NativeSyntheticEvent, NativeScrollEvent } from 'react-native'
import styled from 'styled-components/native'
import TileModel from '../models/TileModel'
import type { ThemeType } from '../../theme/constants/theme'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import NavigationTile from './NavigationTile'
import type { StyledComponent } from 'styled-components'
import {
  ScrollView,
  Dimensions
} from 'react-native'
import { isRTL } from '../../i18n/contentDirection'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const widthBreakPoint = 375
const anchorWidth = 30
const wideScreenItemsCount = 4
const smallScreenItemsCount = 3

type PropsType = {|
  tiles: Array<TileModel>,
  theme: ThemeType,
  navigationItemWidth: number,
  scrollViewWidth: number,
  isScrollable: boolean,
  language: string
|}

const TilesRow: StyledComponent<{}, ThemeType, *> = styled.View`
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
const Icon: StyledComponent<{ width: number }, {}, *> = styled(MaterialIcon)`
  font-size: 30px;
  width: ${props => props.width}px;
`

/**
 * Displays a table of NavigationTiles
*/

type StateType = {| xPosition: number, contentSizeDiff: string |}

class NavigationTiles extends React.PureComponent<
  PropsType,
  StateType
  > {
  state = {
    xPosition: 0,
    contentSizeDiff: '0'
  }

  _scrollview: React$ElementRef<typeof ScrollView>

  onAnchorPress = () => {
    const { navigationItemWidth } = this.props
    const { xPosition, contentSizeDiff } = this.state
    const didReachLastItem = xPosition.toFixed() === contentSizeDiff

    if (!xPosition) {
      this._scrollview &&
        this._scrollview.scrollTo({
          y: 0,
          x: navigationItemWidth,
          animated: true
        })
    } else if (didReachLastItem) {
      this._scrollview &&
        this._scrollview.scrollTo({
          y: 0,
          x: -1,
          animated: true
        })
    } else {
      this._scrollview &&
        this._scrollview.scrollTo({
          y: 0,
          x: xPosition + navigationItemWidth,
          animated: true
        })
    }
  };

  setScrollViewRef = (ref: React$ElementRef<typeof ScrollView>) => {
    this._scrollview = ref
  };

  renderAnchorIcon = (name: string, language: string) => {
    return <Icon
    name={name}
    style={{ transform: [{ scaleX: isRTL(language) ? -1 : 1 }] }}
    onPress={this.onAnchorPress}
    width={anchorWidth}
    />
  }

  onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { nativeEvent } = event
    const contentSizeDiff =
      nativeEvent.contentSize.width - nativeEvent.layoutMeasurement.width

    this.setState({
      xPosition: nativeEvent.contentOffset.x,
      contentSizeDiff: contentSizeDiff.toFixed(2)
    })
  };

  render () {
    const {
      tiles,
      theme,
      navigationItemWidth,
      scrollViewWidth,
      language,
      isScrollable
    } = this.props

    return (
      <TilesRow theme={theme}>
        {isScrollable && this.renderAnchorIcon('keyboard-arrow-left', language)}
        <ScrollView
          horizontal
          ref={this.setScrollViewRef}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'space-around'
          }}
          style={{ width: scrollViewWidth }}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          scrollEnabled
          snapToInterval={navigationItemWidth}
          decelerationRate='fast'
          bounces={false}
          onMomentumScrollEnd={this.onMomentumScrollEnd}
          snapToAlignment='center'>
          {tiles.map(tile => <NavigationTile key={tile.path} tile={tile} theme={theme} width={navigationItemWidth} />)}
        </ScrollView>
        {isScrollable && this.renderAnchorIcon('keyboard-arrow-right', language)}
      </TilesRow>
    )
  }
}

const NavigationTilesWithScrollableView = (props: {
  tiles: Array<TileModel>,
  theme: ThemeType,
  language: string
}) => {
  const { left, right } = useSafeAreaInsets()
  const { width } = Dimensions.get('screen')
  const layoutWidth = (left && right) ? width - (left + right) : width
  const isWideScreen = layoutWidth >= widthBreakPoint
  const scrollviewWidth = layoutWidth - (anchorWidth * 2)
  const itemWidth = isWideScreen
    ? scrollviewWidth / wideScreenItemsCount
    : scrollviewWidth / smallScreenItemsCount
  const allTilesWidth = props.tiles.length * itemWidth
  const isScrollable = allTilesWidth > layoutWidth

  return (
    <NavigationTiles
      navigationItemWidth={itemWidth}
      scrollViewWidth={scrollviewWidth}
      isScrollable={isScrollable}
      {...props}
    />
  )
}
export default NavigationTilesWithScrollableView
