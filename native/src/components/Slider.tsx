import React, { useEffect } from 'react'
import { useWindowDimensions } from 'react-native'
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler'
import Animated, { useSharedValue, useAnimatedStyle, runOnJS } from 'react-native-reanimated'
import styled from 'styled-components/native'

const SLIDER_HANDLE_SIZE = 16

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  gap: 32px;
`

const SliderTrack = styled.View`
  height: 5px;
  background-color: #b9b9b9;
  border-radius: 25px;
  justify-content: center;
  position: relative;
`

const FilledTrack = styled(Animated.View)`
  height: 100%;
  background-color: ${props => props.theme.colors.textSecondaryColor};
  border-radius: 25px;
  position: absolute;
  left: 0;
`

const AnimatedSliderHandle = styled(Animated.View)`
  width: ${SLIDER_HANDLE_SIZE}px;
  height: ${SLIDER_HANDLE_SIZE}px;
  background-color: #232323;
  border-radius: ${SLIDER_HANDLE_SIZE / 2}px;
  position: absolute;
`

const defaultMaxValue = 100

const Slider = ({
  minValue = 0,
  maxValue = defaultMaxValue,
  initialValue = 0, // New prop to set the initial value
  onValueChange,
}: {
  minValue: number
  maxValue: number
  initialValue?: number
  onValueChange: (value: number) => void
}): React.ReactElement => {
  const offset = useSharedValue(0)
  const { width } = useWindowDimensions()
  const widthPercentage = 0.6
  const SLIDER_WIDTH = width * widthPercentage
  const MAX_OFFSET = SLIDER_WIDTH - SLIDER_HANDLE_SIZE

  // Set the initial offset value based on the initialValue prop
  useEffect(() => {
    if (initialValue >= minValue && initialValue <= maxValue) {
      const initialOffset = ((initialValue - minValue) / (maxValue - minValue)) * MAX_OFFSET
      offset.value = initialOffset
    }
  }, [initialValue, minValue, maxValue, MAX_OFFSET, offset])

  const pan = Gesture.Pan().onChange(event => {
    let newValue = offset.value + event.changeX

    if (newValue < 0) {
      newValue = 0
    } else if (newValue > MAX_OFFSET) {
      newValue = MAX_OFFSET
    }

    offset.value = newValue

    const calculatedValue = Math.round(minValue + (offset.value / MAX_OFFSET) * (maxValue - minValue))

    runOnJS(onValueChange)(calculatedValue)
  })

  const sliderHandleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }))

  const filledTrackStyle = useAnimatedStyle(() => ({
    width: offset.value + SLIDER_HANDLE_SIZE / 2,
  }))

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Container>
        <SliderTrack style={{ width: SLIDER_WIDTH }}>
          <FilledTrack style={filledTrackStyle} />
          <GestureDetector gesture={pan}>
            <AnimatedSliderHandle style={sliderHandleStyle} />
          </GestureDetector>
        </SliderTrack>
      </Container>
    </GestureHandlerRootView>
  )
}

export default Slider
