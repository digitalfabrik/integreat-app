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
const ANIMATION_DURATION = 150

type PropsType = {
  uri: string
  /**
   * @param error Error returned by react native of type any
   */
  onError: (error: unknown) => void
}

type StateType = {
  interactive: boolean
  imageDimensions?: { width: number; height: number }
}

export class PinchableBox extends React.Component<PropsType, StateType> {
  private lastOffset: { x: number; y: number }
  private readonly translateX: Animated.AnimatedValue
  private readonly translateY: Animated.AnimatedValue
  private readonly scaledTranslateY: Animated.AnimatedDivision
  private readonly scaledTranslateX: Animated.AnimatedDivision
  private readonly onPanGestureEvent: (event: PanGestureHandlerGestureEvent) => void

  private lastScale: number
  private readonly baseScale: Animated.Value
  private readonly pinchScale: Animated.Value
  private readonly scale: Animated.AnimatedMultiplication
  private readonly onPinchGestureEvent: (event: PinchGestureHandlerGestureEvent) => void

  constructor(props: PropsType) {
    super(props)
    this.state = { interactive: true }

    // Setup: Pinching
    this.baseScale = new Animated.Value(1)
    this.pinchScale = new Animated.Value(1)
    this.scale = Animated.multiply(this.baseScale, this.pinchScale)
    this.lastScale = 1
    this.onPinchGestureEvent = Animated.event([{ nativeEvent: { scale: this.pinchScale } }], {
      useNativeDriver: USE_NATIVE_DRIVER
    })

    // Setup: Panning
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
    // Make translation depend on scale
    this.scaledTranslateX = Animated.divide(this.translateX, this.scale)
    this.scaledTranslateY = Animated.divide(this.translateY, this.scale)

    // Setup: Initialize image dimensions
    const { uri } = props
    Image.getSize(
      uri,
      (width, height) => {
        this.setState({ imageDimensions: { width, height } })
      },
      (error: unknown) => {
        const { onError } = this.props
        onError(error)
      }
    )
  }

  private onImageLoadError = (error: NativeSyntheticEvent<ImageErrorEventData>) => {
    const { onError } = this.props
    onError(error.nativeEvent.error)
  }

  /**
   * Animates the translateX and translateY properties if they are out of bounds
   * @param viewWidth The width of the full area in which the image could appear
   * @param viewHeight The height of the full area in which the image could appear
   * @param realImageWidth The non-scaled default image width
   * @param realImageHeight The non-scaled default image height
   * @param newX The new x translation accumulated over the time of the pan gestures
   * @param newY The new y translation accumulated over the time of the pan gestures
   * @param newScale The new scale accumulated over the time of the pinch gestures
   * @private
   */
  private fixBounds(
    viewWidth: number,
    viewHeight: number,
    realImageWidth: number,
    realImageHeight: number,
    newX: number,
    newY: number,
    newScale: number
  ) {
    // Calculate the minima and maxima which should not be violated
    const widthIncreaseByScale = (Math.max(0, this.lastScale - 1) * realImageWidth) / 2
    const heightIncreaseByScale = (Math.max(0, this.lastScale - 1) * realImageHeight) / 2
    const minX = 0 - widthIncreaseByScale
    const maxX = viewWidth + widthIncreaseByScale - viewWidth
    const minY = 0 - heightIncreaseByScale
    const maxY = viewHeight + heightIncreaseByScale - viewHeight

    if (newX <= minX) {
      // Disable gesture handler during animation
      this.setState(state => ({ ...state, interactive: false }))

      const animation: Animated.CompositeAnimation = Animated.timing(this.translateX, {
        toValue: minX - newX,
        duration: ANIMATION_DURATION,
        useNativeDriver: USE_NATIVE_DRIVER
      })

      animation.start(({ finished }) => {
        if (finished) {
          this.lastOffset.x = minX
          this.translateX.setOffset(minX)
          this.translateX.setValue(0)
        }
        this.setState(state => ({ ...state, interactive: true }))
      })
    }

    if (newX >= maxX) {
      // Disable gesture handler during animation
      this.setState(state => ({ ...state, interactive: false }))

      const animation: Animated.CompositeAnimation = Animated.timing(this.translateX, {
        toValue: maxX - newX,
        duration: ANIMATION_DURATION,
        useNativeDriver: USE_NATIVE_DRIVER
      })
      animation.start(({ finished }) => {
        if (finished) {
          this.lastOffset.x = maxX
          this.translateX.setOffset(maxX)
          this.translateX.setValue(0)
        }
        this.setState(state => ({ ...state, interactive: true }))
      })
    }

    if (newY <= minY) {
      // Disable gesture handler during animation
      this.setState(state => ({ ...state, interactive: false }))

      const animation: Animated.CompositeAnimation = Animated.timing(this.translateY, {
        toValue: minY - newY,
        duration: ANIMATION_DURATION,
        useNativeDriver: USE_NATIVE_DRIVER
      })
      animation.start(({ finished }) => {
        if (finished) {
          this.lastOffset.y = minY
          this.translateY.setOffset(minY)
          this.translateY.setValue(0)
        }
        this.setState(state => ({ ...state, interactive: true }))
      })
    }

    if (newY >= maxY) {
      // Disable gesture handler during animation
      this.setState(state => ({ ...state, interactive: false }))

      const animation: Animated.CompositeAnimation = Animated.timing(this.translateY, {
        toValue: maxY - newY,
        duration: ANIMATION_DURATION,
        useNativeDriver: USE_NATIVE_DRIVER
      })
      animation.start(({ finished }) => {
        if (finished) {
          this.lastOffset.y = maxY
          this.translateY.setOffset(maxY)
          this.translateY.setValue(0)
        }
        this.setState(state => ({ ...state, interactive: true }))
      })
    }

    if (newScale <= 1) {
      // Disable gesture handler during animation
      this.setState(state => ({ ...state, interactive: false }))

      const animation: Animated.CompositeAnimation = Animated.timing(this.baseScale, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: USE_NATIVE_DRIVER
      })
      animation.start(({ finished }) => {
        if (finished) {
          this.lastScale = 1
        }
        this.setState(state => ({ ...state, interactive: true }))
      })
    }
  }

  private createOnPinchHandlerStateChange =
    (viewWidth: number, viewHeight: number, realImageWidth: number, realImageHeight: number) =>
    (event: PinchGestureHandlerStateChangeEvent) => {
      // If the two fingers were lifted from the screen, then...
      if (event.nativeEvent.oldState === State.ACTIVE) {
        const scaleDelta = this.lastScale
        const newScale = scaleDelta * event.nativeEvent.scale
        this.lastScale = newScale
        this.baseScale.setValue(newScale)
        this.pinchScale.setValue(1)

        this.fixBounds(
          viewWidth,
          viewHeight,
          realImageWidth,
          realImageHeight,
          this.lastOffset.x,
          this.lastOffset.y,
          this.lastScale
        )
      }
    }

  private createOnPanHandlerStateChange =
    (viewWidth: number, viewHeight: number, realImageWidth: number, realImageHeight: number) =>
    (event: PanGestureHandlerStateChangeEvent) => {
      if (event.nativeEvent.state === State.END) {
        // Distances the finger was dragged across the screen
        const movedInY = event.nativeEvent.translationY
        const movedInX = event.nativeEvent.translationX
        const previousY = this.lastOffset.y
        const previousX = this.lastOffset.x

        const newY = previousY + movedInY
        this.lastOffset.y = newY
        this.translateY.setOffset(newY)
        this.translateY.setValue(0)

        const newX = previousX + movedInX
        this.lastOffset.x = newX
        this.translateX.setOffset(newX)
        this.translateX.setValue(0)

        this.fixBounds(viewWidth, viewHeight, realImageWidth, realImageHeight, newX, newY, this.lastScale)
      }
    }

  render(): ReactElement | null {
    const pinchHandler = React.createRef()
    const panHandler = React.createRef()
    const { uri } = this.props
    const { imageDimensions, interactive } = this.state

    if (!imageDimensions) {
      return null
    }

    const { width: imageWidth, height: imageHeight } = imageDimensions

    const viewWidth = Dimensions.get('window').width
    const viewHeight = Dimensions.get('window').height
    const realImageWidth = viewWidth
    const realImageHeight = imageHeight * (viewWidth / imageWidth)

    return (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
        <PanGestureHandler
          ref={panHandler}
          simultaneousHandlers={pinchHandler}
          enabled={interactive}
          onGestureEvent={this.onPanGestureEvent}
          onHandlerStateChange={this.createOnPanHandlerStateChange(
            viewWidth,
            viewHeight,
            realImageWidth,
            realImageHeight
          )}
          shouldCancelWhenOutside
          minDist={10}>
          <Animated.View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }} collapsable={false}>
            <PinchGestureHandler
              ref={pinchHandler}
              simultaneousHandlers={panHandler}
              onGestureEvent={this.onPinchGestureEvent}
              onHandlerStateChange={this.createOnPinchHandlerStateChange(
                viewWidth,
                viewHeight,
                realImageWidth,
                realImageHeight
              )}
              shouldCancelWhenOutside={false}>
              <Animated.Image
                style={[
                  {
                    width: realImageWidth,
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
