import React, { ReactElement, useRef, useState } from 'react'
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { TileModel } from 'shared'

import HighlightBox from './HighlightBox'
import NavigationTile from './NavigationTile'
import Icon from './base/Icon'
import Pressable from './base/Pressable'

const widthBreakPoint = 400
const anchorWidth = 30
const wideScreenItemsCount = 4
const smallScreenItemsCount = 3
const scrolledToEndThreshold = 0.95

const TilesRow = styled(HighlightBox)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  shadow-offset: 1px;
`

const StyledPressable = styled(Pressable)`
  padding: 0 4px;
`

const StyledIcon = styled(Icon)<{ disabled: boolean }>`
  color: ${props => (props.disabled ? props.theme.colors.action.disabled : props.theme.colors.onSurface)};
`

type NavigationTilesProps = {
  tiles: TileModel<string>[]
}

const NavigationTiles = ({ tiles }: NavigationTilesProps): ReactElement => {
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
  const [percentageScrolled, setPercentageScrolled] = useState<number>(0)

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentSize, contentOffset, layoutMeasurement } = event.nativeEvent
    setPercentageScrolled(contentOffset.x / (contentSize.width - layoutMeasurement.width))
  }

  const scrolledToStart = percentageScrolled === 0
  const scrolledToEnd = percentageScrolled >= scrolledToEndThreshold

  const scrollToStart = () => scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true })
  const scrollToEnd = () => scrollViewRef.current?.scrollToEnd({ animated: true })

  return (
    <TilesRow>
      {isScrollable && (
        <StyledPressable role='button' onPress={scrollToStart} aria-hidden>
          <StyledIcon source='chevron-left' disabled={scrolledToStart} directionDependent />
        </StyledPressable>
      )}
      <ScrollView
        horizontal
        ref={scrollViewRef}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'space-around',
        }}
        style={{
          width: scrollViewWidth,
        }}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        scrollEnabled
        snapToInterval={navigationItemWidth}
        decelerationRate='fast'
        bounces={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}>
        {tiles.map(tile => (
          <NavigationTile key={tile.path} tile={tile} width={navigationItemWidth} />
        ))}
      </ScrollView>
      {isScrollable && (
        <StyledPressable role='button' onPress={scrollToEnd} aria-hidden>
          <StyledIcon source='chevron-right' disabled={scrolledToEnd} directionDependent />
        </StyledPressable>
      )}
    </TilesRow>
  )
}

export default NavigationTiles
