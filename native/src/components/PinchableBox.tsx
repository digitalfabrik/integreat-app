import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Animated, Dimensions, StyleSheet } from 'react-native'
import { PanGestureHandlerStateChangeEvent } from 'react-native-gesture-handler'
import { PanGestureHandlerGestureEvent } from 'react-native-gesture-handler'
import {
  PanGestureHandler,
  PinchGestureHandler,
  RotationGestureHandler,
  State,
  PinchGestureHandlerGestureEvent,
  PinchGestureHandlerStateChangeEvent
} from 'react-native-gesture-handler'

const USE_NATIVE_DRIVER = true

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pinchableImage: {
    width: 250,
    height: 250
  }
})

type Props = {
  url: string
}

export class PinchableBox extends React.Component {
  private lastOffset: { x: number; y: number }
  private readonly translateX: Animated.AnimatedValue
  private readonly translateY: Animated.AnimatedValue
  private readonly scaledTranslateY: Animated.AnimatedDivision
  private readonly scaledTranslateX: Animated.AnimatedDivision
  private readonly onPanGestureEvent: (event: PanGestureHandlerGestureEvent) => void

  private readonly baseScale: Animated.Value
  private readonly pinchScale: Animated.Value
  private readonly scale: Animated.AnimatedMultiplication
  private lastScale: number
  private readonly onPinchGestureEvent: (event: PinchGestureHandlerGestureEvent) => void

  constructor(props: Props) {
    super(props)

    // Panning
    this.translateX = new Animated.Value(0)
    this.translateY = new Animated.Value(0)

    this.lastOffset = { x: 0, y: 0 }
    this.onPanGestureEvent = Animated.event(
      [
        {
          nativeEvent: {
            translationX: this.translateX,
            translationY: this.translateY
          }
        }
      ],
      { useNativeDriver: USE_NATIVE_DRIVER }
    )

    // Pinching
    this.baseScale = new Animated.Value(1)
    this.pinchScale = new Animated.Value(1)
    this.scale = Animated.multiply(this.baseScale, this.pinchScale)
    this.lastScale = 1
    this.onPinchGestureEvent = Animated.event([{ nativeEvent: { scale: this.pinchScale } }], {
      useNativeDriver: USE_NATIVE_DRIVER
    })

    this.scaledTranslateX = Animated.divide(this.translateX, this.scale)
    this.scaledTranslateY = Animated.divide(this.translateY, this.scale)
  }

  private onPinchHandlerStateChange = (event: PinchGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this.lastScale *= event.nativeEvent.scale
      this.baseScale.setValue(this.lastScale)
      this.pinchScale.setValue(1)
    }
  }

  private onHandlerStateChange = (event: PanGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this.lastOffset.x += event.nativeEvent.translationX
      this.lastOffset.y += event.nativeEvent.translationY
      this.translateX.setOffset(this.lastOffset.x)
      this.translateX.setValue(0)
      this.translateY.setOffset(this.lastOffset.y)
      this.translateY.setValue(0)
    }
  }

  render(): ReactElement {
    const pinchHandler = React.createRef()
    const panHandler = React.createRef()

    return (
      <PanGestureHandler
        ref={panHandler}
        simultaneousHandlers={pinchHandler}
        onGestureEvent={this.onPanGestureEvent}
        onHandlerStateChange={this.onHandlerStateChange}
        minDist={10}>
        <Animated.View style={styles.container} collapsable={false}>
          <PinchGestureHandler
            ref={pinchHandler}
            simultaneousHandlers={panHandler}
            onGestureEvent={this.onPinchGestureEvent}
            onHandlerStateChange={this.onPinchHandlerStateChange}>
            <Animated.Image
              style={[
                styles.pinchableImage,
                {
                  transform: [
                    { scale: this.scale },
                    { translateX: this.scaledTranslateX },
                    { translateY: this.scaledTranslateY }
                  ]
                }
              ]}
              resizeMode='center'
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              source={{
                uri: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png'
              }}
            />
          </PinchGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    )
  }
}

export default PinchableBox
