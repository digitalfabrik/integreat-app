import React, { ReactElement, useRef, useState } from 'react'
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView } from 'react-native'
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

type PropsType = {
  tiles: Array<TileModel>
  theme: ThemeType
}

const NavigationTilesWithScrollableView = ({ tiles, theme }: PropsType): ReactElement => {
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
  const [currentPosition, setCurrentPosition] = useState<number>(0)

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setCurrentPosition(event.nativeEvent.contentOffset.x)
  }

  const updatePosition = (position: 'start' | 'end') => {
    setCurrentPosition(position === 'start' ? 0 : navigationItemWidth)
  }

  return (
    <TilesRow>
      {isScrollable && (
        <AnchorIcon
          name='keyboard-arrow-left'
          isLeftAnchor
          scrollViewRef={scrollViewRef.current}
          updatePosition={updatePosition}
          disabled={currentPosition === 0}
        />
      )}
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
        bounces={false}
        onScroll={handleScroll}>
        {tiles.map(tile => (
          <NavigationTile key={tile.path} tile={tile} theme={theme} width={navigationItemWidth} />
        ))}
      </ScrollView>
      {isScrollable && (
        <AnchorIcon
          name='keyboard-arrow-right'
          isLeftAnchor={false}
          scrollViewRef={scrollViewRef.current}
          updatePosition={updatePosition}
          disabled={currentPosition >= navigationItemWidth}
        />
      )}
    </TilesRow>
  )
}

export default NavigationTilesWithScrollableView
