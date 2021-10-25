import React, { ReactElement } from 'react'
import { Animated, Dimensions, Image, ImageErrorEventData, NativeSyntheticEvent, View } from 'react-native'
import {
  PanGestureHandler,
  PinchGestureHandler,
  PanGestureHandlerGestureEvent,
  PanGestureHandlerStateChangeEvent,
  PinchGestureHandlerGestureEvent,
  PinchGestureHandlerStateChangeEvent,
  State
} from 'react-native-gesture-handler'

const USE_NATIVE_DRIVER = true

type PropsType = {
  uri: string
  /**
   * @param error Error returned by react native of type any
   */
  onError: (error: any) => void
}

type StateType = {
  imageDimensions?: { width: number; height: number }
}

export class PinchableBox extends React.Component<PropsType, StateType> {
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

  constructor(props: PropsType) {
    super(props)

    this.state = {}

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

    // Make translation depend on scale
    this.scaledTranslateX = Animated.divide(this.translateX, this.scale)
    this.scaledTranslateY = Animated.divide(this.translateY, this.scale)

    const { uri } = props
    Image.getSize(uri, (width, height) => {
      this.setState({ imageDimensions: { width, height } })
    })
  }

  private onPinchHandlerStateChange = (event: PinchGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this.lastScale *= event.nativeEvent.scale
      this.baseScale.setValue(this.lastScale)
      this.pinchScale.setValue(1)

      if (this.lastScale <= 1) {
        Animated.spring(this.baseScale, {
          toValue: 1,
          useNativeDriver: USE_NATIVE_DRIVER
        }).start(({ finished }) => {
          if (finished) {
            this.lastScale = 1
          }
        })
      }
    }
  }

  private onImageLoadError = (error: NativeSyntheticEvent<ImageErrorEventData>) => {
    this.props.onError(error.nativeEvent.error)
  }

  private onPanHandlerStateChange =
    (viewWidth: number, viewHeight: number, imageWidth: number, imageHeight: number) =>
    (event: PanGestureHandlerStateChangeEvent) => {
      if (event.nativeEvent.oldState === State.ACTIVE) {
        const yDelta = event.nativeEvent.translationY
        const xDelta = event.nativeEvent.translationX

        const widthIncreaseByScale = (Math.max(0, this.lastScale - 1) * viewWidth) / 2
        const heightIncreaseByScale = (Math.max(0, this.lastScale - 1) * viewHeight) / 2

        const minX = 0 - widthIncreaseByScale
        const maxX = viewWidth + widthIncreaseByScale - imageWidth
        const minY = 0 - heightIncreaseByScale
        const maxY = viewHeight + heightIncreaseByScale - imageHeight

        this.lastOffset.y += yDelta
        this.translateY.setOffset(this.lastOffset.y)
        this.translateY.setValue(0)

        this.lastOffset.x += xDelta
        this.translateX.setOffset(this.lastOffset.x)
        this.translateX.setValue(0)

        // Fix position if below x = 0
        if (this.lastOffset.x <= minX) {
          // todo: what should happen if this animation is interrupted?
          Animated.spring(this.translateX, {
            toValue: minX - this.lastOffset.x,
            useNativeDriver: USE_NATIVE_DRIVER
          }).start(({ finished }) => {
            if (finished) {
              this.lastOffset.x = minX
              this.translateX.setOffset(minX)
              this.translateX.setValue(0)
            }
          })
        }

        // Fix position if above x = screen width
        if (this.lastOffset.x >= maxX) {
          Animated.spring(this.translateX, {
            toValue: maxX - this.lastOffset.x,
            useNativeDriver: USE_NATIVE_DRIVER
          }).start(({ finished }) => {
            if (finished) {
              this.lastOffset.x = maxX
              this.translateX.setOffset(maxX)
              this.translateX.setValue(0)
            }
          })
        }

        // Fix position if below y = 0
        if (this.lastOffset.y <= minY) {
          Animated.spring(this.translateY, {
            toValue: minY - this.lastOffset.y,
            useNativeDriver: USE_NATIVE_DRIVER
          }).start(({ finished }) => {
            if (finished) {
              this.lastOffset.y = minY
              this.translateY.setOffset(minY)
              this.translateY.setValue(0)
            }
          })
        }

        // Fix position if above y = screen height
        if (this.lastOffset.y >= maxY) {
          Animated.spring(this.translateY, {
            toValue: maxY - this.lastOffset.y,
            useNativeDriver: USE_NATIVE_DRIVER
          }).start(({ finished }) => {
            if (finished) {
              this.lastOffset.y = maxY
              this.translateY.setOffset(maxY)
              this.translateY.setValue(0)
            }
          })
        }

        // todo: handle for zoom?
      }
    }

  render(): ReactElement | null {
    const pinchHandler = React.createRef()
    const panHandler = React.createRef()
    const { uri } = this.props
    const { imageDimensions } = this.state

    if (!imageDimensions) {
      return null
    }

    const { width: imageWidth, height: imageHeight } = imageDimensions

    const viewWidth = Dimensions.get('window').width
    const realImageHeight = imageHeight * (viewWidth / imageWidth)
    const viewHeight = realImageHeight

    return (
      <View style={{ width: viewWidth, height: viewHeight, overflow: 'hidden' }}>
        <PanGestureHandler
          ref={panHandler}
          simultaneousHandlers={pinchHandler}
          onGestureEvent={this.onPanGestureEvent}
          onHandlerStateChange={this.onPanHandlerStateChange(viewWidth, viewHeight, viewWidth, viewHeight)}
          shouldCancelWhenOutside
          minDist={10}>
          <Animated.View style={{ flex: 1 }} collapsable={false}>
            <PinchGestureHandler
              ref={pinchHandler}
              simultaneousHandlers={panHandler}
              onGestureEvent={this.onPinchGestureEvent}
              onHandlerStateChange={this.onPinchHandlerStateChange}
              shouldCancelWhenOutside>
              <Animated.Image
                style={[
                  {
                    width: viewWidth,
                    height: realImageHeight
                  },
                  {
                    transform: [
                      { scale: this.scale },
                      { translateX: this.scaledTranslateX },
                      { translateY: this.scaledTranslateY }
                    ]
                  }
                ]}
                onError={this.onImageLoadError}
                resizeMode='stretch'
                source={{
                  uri
                }}
              />
            </PinchGestureHandler>
          </Animated.View>
        </PanGestureHandler>
      </View>
    )
  }
}

export default PinchableBox
