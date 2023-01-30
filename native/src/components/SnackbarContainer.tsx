import React, { createContext, ReactElement, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Animated, View, LayoutChangeEvent } from 'react-native'
import styled from 'styled-components/native'

import Snackbar, { SnackbarActionType } from '../components/Snackbar'

const Container = styled(View)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`

// https://github.com/styled-components/styled-components/issues/892
const AnimatedContainer = Animated.createAnimatedComponent(Container)
const ANIMATION_DURATION = 300
const DEFAULT_SHOW_DURATION = 5000
const MAX_HEIGHT = 9999
const translate = new Animated.Value(1)

export type SnackbarType = {
  text: string
  positiveAction?: SnackbarActionType
  negativeAction?: SnackbarActionType
  showDuration?: number
}

type SnackbarContextType = (snackbar: SnackbarType) => void
export const SnackbarContext = createContext<SnackbarContextType>(() => undefined)

type SnackbarContainerProps = {
  children: ReactElement
}

const SnackbarContainer = ({ children }: SnackbarContainerProps): ReactElement | null => {
  const [height, setHeight] = useState<number | null>(null)
  const [enqueuedSnackbars, setEnqueuedSnackbars] = useState<SnackbarType[]>([])
  const displayedSnackbar = enqueuedSnackbars[0]
  const { t } = useTranslation('error')

  const enqueueSnackbar = useCallback((snackbar: SnackbarType) => {
    // Don't show same snackbar multiple times
    setEnqueuedSnackbars(snackbars => (snackbars[0]?.text !== snackbar.text ? [...snackbars, snackbar] : snackbars))
  }, [])

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
    }).start(() => setEnqueuedSnackbars(snackbars => snackbars.slice(1)))
  }, [])

  useEffect(() => {
    if (displayedSnackbar) {
      show()
      const timeout = setTimeout(hide, displayedSnackbar.showDuration ?? DEFAULT_SHOW_DURATION)
      return () => clearTimeout(timeout)
    }
    return () => undefined
  }, [displayedSnackbar, hide, show])

  const onLayout = (event: LayoutChangeEvent) => setHeight(event.nativeEvent.layout.height)

  const outputRange: number[] = [0, height ?? MAX_HEIGHT]
  const interpolated = translate.interpolate({
    inputRange: [0, 1],
    outputRange,
  })

  return (
    <SnackbarContext.Provider value={enqueueSnackbar}>
      {children}
      {displayedSnackbar ? (
        <AnimatedContainer
          onLayout={onLayout}
          style={{
            transform: [
              {
                translateY: interpolated,
              },
            ],
          }}>
          <Snackbar
            text={t(displayedSnackbar.text)}
            positiveAction={displayedSnackbar.positiveAction}
            negativeAction={displayedSnackbar.negativeAction}
          />
        </AnimatedContainer>
      ) : null}
    </SnackbarContext.Provider>
  )
}

export default SnackbarContainer
