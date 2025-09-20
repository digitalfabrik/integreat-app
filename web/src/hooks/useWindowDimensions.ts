import { useContext, useEffect, useState } from 'react'

import { BOTTOM_NAVIGATION_ELEMENT_ID } from '../components/BottomNavigation'
import { BREAKPOINTS } from '../components/ThemeContainer'
import { TtsContext } from '../components/TtsContainer'
import { TTS_PLAYER_ELEMENT_ID } from '../components/TtsPlayer'

type WindowDimensions = {
  width: number
  height: number
  scrollX: number
  scrollY: number
}

export type WindowDimensionsType = {
  window: WindowDimensions

  headerHeight: number
  visibleFooterHeight: number
  ttsPlayerHeight: number
  bottomNavigationHeight: number | undefined

  mobile: boolean
  desktop: boolean
  small: boolean
  medium: boolean
  large: boolean
  xlarge: boolean
}

const getWindowDimensions = (): WindowDimensionsType => {
  const { innerWidth: width, innerHeight: height, scrollX, scrollY } = window
  const headerHeight = document.querySelector('header')?.offsetHeight ?? 0
  const ttsPlayerHeight = document.getElementById(TTS_PLAYER_ELEMENT_ID)?.getBoundingClientRect().height ?? 0
  const bottomNavigationHeight = document.getElementById(BOTTOM_NAVIGATION_ELEMENT_ID)?.getBoundingClientRect().height

  const footerHeight = document.querySelector('footer')?.offsetHeight ?? 0
  const documentHeight = document.body.offsetHeight
  const visibleFooterHeight = Math.max(0, height + scrollY + footerHeight - documentHeight)

  return {
    window: { width, height, scrollX, scrollY },
    headerHeight,
    visibleFooterHeight,
    ttsPlayerHeight,
    bottomNavigationHeight,

    mobile: width <= BREAKPOINTS.md,
    desktop: width > BREAKPOINTS.md,
    small: width <= BREAKPOINTS.sm,
    medium: width > BREAKPOINTS.sm && width <= BREAKPOINTS.md,
    large: width > BREAKPOINTS.md && width <= BREAKPOINTS.xl,
    xlarge: width > BREAKPOINTS.xl,
  }
}

const useWindowDimensions = (): WindowDimensionsType => {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())
  const { visible } = useContext(TtsContext)

  useEffect(() => {
    // Observe changes to the DOM body and recalculate all window dimensions (e.g. for adding/removing the tts player)
    const resizeObserver = new ResizeObserver(() => setWindowDimensions(getWindowDimensions()))
    resizeObserver.observe(document.body)
    return () => resizeObserver.disconnect()
  }, [visible])

  useEffect(() => {
    // Observe changes to the window sizes or the scroll position and recalculate all window dimensions
    const handleResize = () => setWindowDimensions(getWindowDimensions())
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleResize)
    }
  }, [])

  return windowDimensions
}

export default useWindowDimensions
