import React, { ReactElement, useRef, useState } from 'react'
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet } from 'react-native'
import { TouchableRipple, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { DefaultTheme } from 'styled-components/native'

import { TileModel } from 'shared'

import HighlightBox from './HighlightBox'
import NavigationTile from './NavigationTile'
import Icon from './base/Icon'

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
`

const styles = StyleSheet.create({
  styledTouchableRipple: {
    paddingHorizontal: 4,
  },
})

type NavigationTilesProps = {
  tiles: TileModel<string>[]
}

const NavigationTiles = ({ tiles }: NavigationTilesProps): ReactElement => {
  const { left, right } = useSafeAreaInsets()
  const theme = useTheme() as DefaultTheme
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
        <TouchableRipple
          borderless
          role='button'
          onPress={scrollToStart}
          aria-hidden
          style={styles.styledTouchableRipple}>
          <Icon
            source='chevron-left'
            style={{ color: scrolledToStart ? theme.colors.action.disabled : theme.colors.onSurface }}
            directionDependent
          />
        </TouchableRipple>
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
        <TouchableRipple role='button' onPress={scrollToEnd} aria-hidden style={styles.styledTouchableRipple}>
          <Icon
            source='chevron-right'
            style={{ color: scrolledToEnd ? theme.colors.action.disabled : theme.colors.onSurface }}
            directionDependent
          />
        </TouchableRipple>
      )}
    </TilesRow>
  )
}

export default NavigationTiles
