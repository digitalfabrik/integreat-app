import React, { ReactElement, useRef } from 'react'
import { Dimensions, ScrollView } from 'react-native'
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

const NavigationTilesWithScrollableView = (props: { tiles: Array<TileModel>; theme: ThemeType }): ReactElement => {
  const { tiles, theme } = props
  const { left, right } = useSafeAreaInsets()
  const { width } = Dimensions.get('screen')
  const layoutWidth = left && right ? width - (left + right) : width
  const isWideScreen = layoutWidth >= widthBreakPoint
  const scrollViewWidth: number = layoutWidth - anchorWidth * 2
  const navigationItemWidth = isWideScreen
    ? scrollViewWidth / wideScreenItemsCount
    : scrollViewWidth / smallScreenItemsCount
  const allTilesWidth = tiles.length * navigationItemWidth
  const isScrollable = allTilesWidth > layoutWidth

  const scrollViewRef = useRef<ScrollView>(null)

  return (
    <TilesRow theme={theme}>
      {isScrollable && <AnchorIcon name='keyboard-arrow-left' isLeftAnchor scrollViewRef={scrollViewRef.current} />}
      <ScrollView
        horizontal
        ref={scrollViewRef}
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
        bounces={false}>
        {tiles.map(tile => (
          <NavigationTile key={tile.path} tile={tile} theme={theme} width={navigationItemWidth} />
        ))}
      </ScrollView>
      {isScrollable && (
        <AnchorIcon name='keyboard-arrow-right' isLeftAnchor={false} scrollViewRef={scrollViewRef.current} />
      )}
    </TilesRow>
  )
}

export default NavigationTilesWithScrollableView
