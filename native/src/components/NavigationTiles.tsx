import React, { ReactElement } from 'react'
import { Dimensions, ScrollView, NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { ThemeType } from 'build-configs'

import TileModel from '../models/TileModel'
import AnchorIcon from './AnchorIcon'
import NavigationTile from './NavigationTile'

const widthBreakPoint = 400
const anchorWidth = 30
const wideScreenItemsCount = 4
const smallScreenItemsCount = 3

type PropsType = {
  tiles: Array<TileModel>
  theme: ThemeType
  navigationItemWidth: number
  scrollViewWidth: number
  isScrollable: boolean
  language: string
}
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

/**
 * Displays a table of NavigationTiles
 */
type StateType = {
  xPosition: number
  contentSizeDiff: number
  _scrollView: React.ElementRef<typeof ScrollView> | null | undefined
}

class NavigationTiles extends React.PureComponent<PropsType, StateType> {
  state = {
    xPosition: 0,
    contentSizeDiff: 0,
    _scrollView: null
  }

  setScrollViewRef = (ref: React.ElementRef<typeof ScrollView> | null | undefined) => {
    this.setState({
      _scrollView: ref
    })
  }

  onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { nativeEvent } = event
    const contentSizeDiff = nativeEvent.contentSize.width - nativeEvent.layoutMeasurement.width
    this.setState({
      xPosition: nativeEvent.contentOffset.x,
      contentSizeDiff: parseInt(contentSizeDiff.toFixed(0), 10)
    })
  }

  render() {
    const { tiles, theme, navigationItemWidth, scrollViewWidth, language, isScrollable } = this.props
    const { xPosition, contentSizeDiff, _scrollView } = this.state
    return (
      <TilesRow theme={theme}>
        {isScrollable && (
          <AnchorIcon
            name='keyboard-arrow-left'
            language={language}
            navigationItemWidth={navigationItemWidth}
            _scrollView={_scrollView}
            xPosition={xPosition}
            contentSizeDiff={contentSizeDiff}
          />
        )}
        <ScrollView
          horizontal
          ref={this.setScrollViewRef}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'space-around'
          }}
          style={{
            width: scrollViewWidth
          }}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          scrollEnabled
          snapToInterval={navigationItemWidth}
          decelerationRate='fast'
          bounces={false}
          onMomentumScrollEnd={this.onMomentumScrollEnd}
          snapToAlignment='center'>
          {tiles.map(tile => (
            <NavigationTile key={tile.path} tile={tile} theme={theme} width={navigationItemWidth} />
          ))}
        </ScrollView>
        {isScrollable && (
          <AnchorIcon
            name='keyboard-arrow-right'
            language={language}
            navigationItemWidth={navigationItemWidth}
            _scrollView={_scrollView}
            xPosition={xPosition}
            contentSizeDiff={contentSizeDiff}
          />
        )}
      </TilesRow>
    )
  }
}

const NavigationTilesWithScrollableView = (props: {
  tiles: Array<TileModel>
  theme: ThemeType
  language: string
}): ReactElement => {
  const { tiles } = props
  const { left, right } = useSafeAreaInsets()
  const { width } = Dimensions.get('screen')
  const layoutWidth = left && right ? width - (left + right) : width
  const isWideScreen = layoutWidth >= widthBreakPoint
  const scrollviewWidth: number = layoutWidth - anchorWidth * 2
  const itemWidth = isWideScreen ? scrollviewWidth / wideScreenItemsCount : scrollviewWidth / smallScreenItemsCount
  const allTilesWidth = tiles.length * itemWidth
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
