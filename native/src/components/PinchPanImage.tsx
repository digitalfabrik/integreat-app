import React, { ReactElement, useEffect, useState } from 'react'
import { Image, useWindowDimensions } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, { clamp, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

const MIN_DISTANCE = 10

type Dimensions = { width: number; height: number }

type PinchPanImageProps = {
  uri: string
  onError: (error: unknown) => void
}

const clampTranslationToImageBounds = (translation: number, viewSize: number, scale: number): number => {
  'worklet'

  if (scale <= 1) {
    return 0
  }
  return clamp(translation, -(viewSize / 2) * (scale - 1), (viewSize / 2) * (scale - 1))
}

const PinchPanImage = ({ uri, onError }: PinchPanImageProps): ReactElement => {
  const viewWidth = useWindowDimensions().width
  const viewHeight = useWindowDimensions().height
  const [imageDimensions, setImageDimensions] = useState<Dimensions>()

  useEffect(() => {
    Image.getSize(
      uri,
      (width, height) => setImageDimensions({ width, height }),
      err => onError(err),
    )
  }, [uri, onError])

  const prevScale = useSharedValue(1)
  const scale = useSharedValue(1)

  const translationX = useSharedValue(0)
  const translationY = useSharedValue(0)
  const prevTranslationX = useSharedValue(0)
  const prevTranslationY = useSharedValue(0)

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: translationX.value }, { translateY: translationY.value }, { scale: scale.value }],
  }))

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      prevScale.value = scale.value
    })
    .onUpdate(event => {
      scale.value = prevScale.value * event.scale
    })

  const { width: imageWidth, height: imageHeight } = imageDimensions || { width: 0, height: 0 }

  const panGesture = Gesture.Pan()
    .minDistance(MIN_DISTANCE)
    .onStart(() => {
      prevTranslationX.value = translationX.value
      prevTranslationY.value = translationY.value
    })
    .onUpdate(event => {
      translationX.value = prevTranslationX.value + event.translationX
      translationY.value = prevTranslationY.value + event.translationY
    })
    .onFinalize(() => {
      translationX.value = withSpring(clampTranslationToImageBounds(translationX.value, viewWidth, scale.value), {
        damping: 20,
      })
      translationY.value = withSpring(clampTranslationToImageBounds(translationY.value, viewHeight, scale.value), {
        damping: 20,
      })
    })

  const combinedGesture = Gesture.Simultaneous(pinchGesture, panGesture)

  const isPortraitMode = viewWidth < viewHeight
  const realImageWidth = isPortraitMode ? viewWidth : imageWidth * (viewHeight / imageHeight)
  const realImageHeight = isPortraitMode ? imageHeight * (viewWidth / imageWidth) : viewHeight

  return (
    <GestureDetector gesture={combinedGesture}>
      <Animated.Image
        source={{ uri }}
        style={[
          {
            width: realImageWidth,
            height: realImageHeight,
          },
          animatedStyles,
        ]}
        onError={onError}
      />
    </GestureDetector>
  )
}

export default PinchPanImage
