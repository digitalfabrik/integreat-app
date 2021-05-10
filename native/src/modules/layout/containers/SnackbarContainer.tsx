import React, { useState, useEffect, useCallback } from 'react'
import { Animated } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import type { StyledComponent } from 'styled-components'
import styled from 'styled-components/native'
import type { ViewLayoutEvent } from 'react-native/Libraries/Components/View/ViewPropTypes'
import type { SnackbarType, StateType } from '../../app/StateType'
import Snackbar from '../components/Snackbar'
import type { ThemeType } from 'build-configs/ThemeType'
const Container: StyledComponent<{}, ThemeType, any> = styled(Animated.View)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`
const ANIMATION_DURATION = 300
const SHOW_DURATION = 5000
const MAX_HEIGHT = 9999
const translate = new Animated.Value(1)

const SnackbarContainer = () => {
  const [height, setHeight] = useState<number | null>(null)
  const [displayed, setDisplayed] = useState<SnackbarType | null>(null)
  const snackbarState: Array<SnackbarType> = useSelector((state: StateType) => state.snackbar)
  const dispatch = useDispatch()
  const { t } = useTranslation('error')
  const show = useCallback(() => {
    Animated.timing(translate, {
      toValue: 0,
      duration: ANIMATION_DURATION,
      useNativeDriver: true
    }).start()
  }, [])
  const hide = useCallback(() => {
    Animated.timing(translate, {
      toValue: 1,
      duration: ANIMATION_DURATION,
      useNativeDriver: true
    }).start(() => setDisplayed(null))
  }, [])
  useEffect(() => {
    if (!displayed && snackbarState.length > 0) {
      const newSnackbar = snackbarState[0]
      setDisplayed(newSnackbar)
      dispatch({
        type: 'DEQUEUE_SNACKBAR'
      })
    }
  }, [snackbarState, displayed, dispatch])
  useEffect(() => {
    if (displayed) {
      show()
      const timeout = setTimeout(() => {
        hide()
      }, SHOW_DURATION)
      return () => clearTimeout(timeout)
    }
  }, [displayed, hide, show])

  const onLayout = (event: ViewLayoutEvent) => setHeight(event.nativeEvent.layout.height)

  const outputRange: number[] = [0, height ?? MAX_HEIGHT]
  const interpolated = translate.interpolate({
    inputRange: [0, 1],
    outputRange: outputRange
  })
  return displayed ? (
    <Container
      onLayout={onLayout}
      style={{
        transform: [
          {
            translateY: interpolated
          }
        ]
      }}>
      <Snackbar message={t(displayed.text)} />
    </Container>
  ) : null
}

export default SnackbarContainer
