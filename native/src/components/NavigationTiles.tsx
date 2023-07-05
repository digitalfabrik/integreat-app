import React, { ReactElement, useRef, useState } from 'react'
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import TileModel from '../models/TileModel'
import AnchorIcon from './AnchorIcon'
import HighlightBox from './HighlightBox'
import NavigationTile from './NavigationTile'

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

type NavigationTilesProps = {
  tiles: Array<TileModel>
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
  const theme = useTheme()

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
      {isScrollable && <AnchorIcon isLeftAnchor onPress={scrollToStart} disabled={scrolledToStart} />}
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
          <NavigationTile key={tile.path} tile={tile} theme={theme} width={navigationItemWidth} />
        ))}
      </ScrollView>
      {isScrollable && <AnchorIcon isLeftAnchor={false} onPress={scrollToEnd} disabled={scrolledToEnd} />}
    </TilesRow>
  )
}

export default NavigationTiles
