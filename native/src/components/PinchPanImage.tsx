import React, { ReactElement } from 'react'
import { Animated, Image, ImageErrorEventData, NativeSyntheticEvent } from 'react-native'
import {
  PanGestureHandler,
  PinchGestureHandler,
  PanGestureHandlerGestureEvent,
  PanGestureHandlerStateChangeEvent,
  PinchGestureHandlerGestureEvent,
  PinchGestureHandlerStateChangeEvent,
  State,
} from 'react-native-gesture-handler'
import styled from 'styled-components/native'

const USE_NATIVE_DRIVER = true
const ANIMATION_DURATION = 150

const Container = styled.View`
  flex: 1;
`

type PinchPanImagePropsType = {
  uri: string
  /**
   * @param error Error returned by react native of type any
   */
  onError: (error: unknown) => void
}

type StateType = {
  /**
   * We do not allow to interact (pinch/pan) while an animation is in progress. The reason for this is that we do not
   * have a way to get the current position of an element when the animation is cancelled through an interaction.
   * Therefore, we disable animation.
   */
  interactive: boolean
  viewDimensions?: { width: number; height: number }
  imageDimensions?: { width: number; height: number }
}

class PinchPanImage extends React.Component<PinchPanImagePropsType, StateType> {
  private lastOffset: { x: number; y: number }
  private readonly panHandler: React.RefObject<PanGestureHandler>
  // Used to hold the a translation of the image which has been recorded via panning
  private readonly translateX: Animated.AnimatedValue
  private readonly translateY: Animated.AnimatedValue
  // Used for applying an the lastOffset to the position of the image
  private readonly translateXOffset: Animated.AnimatedValue
  private readonly translateYOffset: Animated.AnimatedValue
  private readonly scaledTranslateYWithOffset: Animated.AnimatedDivision
  private readonly scaledTranslateXWithOffset: Animated.AnimatedDivision
  private readonly onPanGestureEvent: (event: PanGestureHandlerGestureEvent) => void

  private lastScale: number
  private readonly pinchHandler: React.RefObject<PinchGestureHandler>
  private readonly baseScale: Animated.Value
  private readonly pinchScale: Animated.Value
  private readonly scale: Animated.AnimatedMultiplication
  private readonly onPinchGestureEvent: (event: PinchGestureHandlerGestureEvent) => void

  constructor(props: PinchPanImagePropsType) {
    super(props)
    this.state = { interactive: true }

    this.pinchHandler = React.createRef()
    this.panHandler = React.createRef()

    // Setup: Pinching
    this.baseScale = new Animated.Value(1)
    this.pinchScale = new Animated.Value(1)
    this.scale = Animated.multiply(this.baseScale, this.pinchScale)
    this.lastScale = 1
    this.onPinchGestureEvent = Animated.event([{ nativeEvent: { scale: this.pinchScale } }], {
      useNativeDriver: USE_NATIVE_DRIVER,
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
            translationY: this.translateY,
          },
        },
      ],
      { useNativeDriver: USE_NATIVE_DRIVER }
    )
    this.translateXOffset = new Animated.Value(0)
    this.translateYOffset = new Animated.Value(0)

    // Make translation depend on scale and offset
    this.scaledTranslateXWithOffset = Animated.divide(Animated.add(this.translateX, this.translateXOffset), this.scale)
    this.scaledTranslateYWithOffset = Animated.divide(Animated.add(this.translateY, this.translateYOffset), this.scale)

    // Setup: Initialize image dimensions
    const { uri, onError } = props
    Image.getSize(
      uri,
      (width, height) => {
        this.setState(state => ({ ...state, imageDimensions: { width, height } }))
      },
      (error: unknown) => {
        onError(error)
      }
    )
  }

  private onImageLoadError = (error: NativeSyntheticEvent<ImageErrorEventData>) => {
    const { onError } = this.props
    onError(error.nativeEvent.error)
  }

  /**
   * Moves the image along some axis back into the view. This animates the translateX and translateY properties
   * if they are out of bounds
   */
  private fixBound(axis: 'x' | 'y', minValue: number, newValue: number) {
    this.setState(state => ({ ...state, interactive: false }))

    const animation: Animated.CompositeAnimation = Animated.timing(axis === 'x' ? this.translateX : this.translateY, {
      toValue: minValue - newValue,
      duration: ANIMATION_DURATION,
      useNativeDriver: USE_NATIVE_DRIVER,
    })

    animation.start(({ finished }) => {
      if (finished) {
        if (axis === 'x') {
          this.lastOffset.x = minValue
          this.translateXOffset.setValue(minValue)
          this.translateX.setValue(0)
        } else {
          this.lastOffset.y = minValue
          this.translateYOffset.setValue(minValue)
          this.translateY.setValue(0)
        }
      }
      this.setState(state => ({ ...state, interactive: true }))
    })
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
      this.fixBound('x', minX, newX)
    }

    if (newX >= maxX) {
      this.fixBound('x', maxY, newX)
    }

    if (newY <= minY) {
      this.fixBound('y', minY, newY)
    }

    if (newY >= maxY) {
      this.fixBound('y', maxY, newY)
    }

    if (newScale <= 1) {
      // Disable gesture handler during animation
      this.setState(state => ({ ...state, interactive: false }))

      const animation: Animated.CompositeAnimation = Animated.timing(this.baseScale, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: USE_NATIVE_DRIVER,
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
        this.translateYOffset.setValue(newY)
        this.translateY.setValue(0)

        const newX = previousX + movedInX
        this.lastOffset.x = newX
        this.translateXOffset.setValue(newX)
        this.translateX.setValue(0)

        this.fixBounds(viewWidth, viewHeight, realImageWidth, realImageHeight, newX, newY, this.lastScale)
      }
    }

  render(): ReactElement | null {
    const { uri } = this.props
    const { imageDimensions, viewDimensions, interactive } = this.state

    if (!imageDimensions || !viewDimensions) {
      return (
        <Container
          onLayout={event => {
            const { width, height } = event.nativeEvent.layout
            this.setState(state => ({ ...state, viewDimensions: { width, height } }))
          }}
        />
      )
    }

    const { width: viewWidth, height: viewHeight } = viewDimensions
    const { width: imageWidth, height: imageHeight } = imageDimensions

    const shouldImageBeLandscape = viewWidth < viewHeight
    const realImageWidth = shouldImageBeLandscape ? viewWidth : imageWidth * (viewHeight / imageHeight)
    const realImageHeight = shouldImageBeLandscape ? imageHeight * (viewWidth / imageWidth) : viewHeight

    return (
      <Container
        onLayout={event => {
          const { width, height } = event.nativeEvent.layout
          this.setState(state => ({ ...state, viewDimensions: { width, height } }))
        }}>
        <PanGestureHandler
          ref={this.panHandler}
          simultaneousHandlers={this.pinchHandler}
          enabled={interactive}
          onGestureEvent={this.onPanGestureEvent}
          onHandlerStateChange={this.createOnPanHandlerStateChange(
            viewWidth,
            viewHeight,
            realImageWidth,
            realImageHeight
          )}
          minDist={10}>
          <Animated.View
            style={{ flex: 1, flexDirection: shouldImageBeLandscape ? 'column' : 'row', justifyContent: 'center' }}
            collapsable={false}>
            <PinchGestureHandler
              ref={this.pinchHandler}
              enabled={interactive}
              simultaneousHandlers={this.panHandler}
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
                    height: realImageHeight,
                  },
                  {
                    transform: [
                      { scale: this.scale },
                      { translateX: this.scaledTranslateXWithOffset },
                      { translateY: this.scaledTranslateYWithOffset },
                    ],
                  },
                ]}
                onError={this.onImageLoadError}
                resizeMode='stretch'
                source={{
                  uri,
                }}
              />
            </PinchGestureHandler>
          </Animated.View>
        </PanGestureHandler>
      </Container>
    )
  }
}

export default PinchPanImage
