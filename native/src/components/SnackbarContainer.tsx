import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Animated, View, LayoutChangeEvent } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/native'

import Snackbar from '../components/Snackbar'
import { SnackbarType, StateType } from '../redux/StateType'

const Container = styled(View)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`
// https://github.com/styled-components/styled-components/issues/892
const AnimatedContainer = Animated.createAnimatedComponent(Container)
const ANIMATION_DURATION = 300
const SHOW_DURATION = 5000
const MAX_HEIGHT = 9999
const translate = new Animated.Value(1)
const SnackbarContainer = (): ReactElement | null => {
  const [height, setHeight] = useState<number | null>(null)
  const [displayed, setDisplayed] = useState<SnackbarType | null>(null)
  const snackbarState = useSelector<StateType, Array<SnackbarType>>((state: StateType) => state.snackbar)
  const dispatch = useDispatch()
  const { t } = useTranslation('error')

  const show = useCallback(() => {
    Animated.timing(translate, {
      toValue: 0,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start()
  }, [])

  const hide = useCallback(() => {
    Animated.timing(translate, {
      toValue: 1,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start(() => setDisplayed(null))
  }, [])

  useEffect(() => {
    const newSnackbar = snackbarState[0]
    if (!displayed && newSnackbar) {
      setDisplayed(newSnackbar)
      dispatch({
        type: 'DEQUEUE_SNACKBAR',
      })
    }
  }, [snackbarState, displayed, dispatch])

  useEffect(() => {
    if (displayed) {
      show()
      const timeout = setTimeout(hide, SHOW_DURATION)
      return () => clearTimeout(timeout)
    }
    return () => undefined
  }, [displayed, hide, show])

  const onLayout = (event: LayoutChangeEvent) => setHeight(event.nativeEvent.layout.height)

  const outputRange: number[] = [0, height ?? MAX_HEIGHT]
  const interpolated = translate.interpolate({
    inputRange: [0, 1],
    outputRange,
  })
  return displayed ? (
    <AnimatedContainer
      onLayout={onLayout}
      style={{
        transform: [
          {
            translateY: interpolated,
          },
        ],
      }}>
      <Snackbar message={t(displayed.text)} />
    </AnimatedContainer>
  ) : null
}

export default SnackbarContainer
