import { useState, useEffect, useContext } from 'react'

import { BOTTOM_NAVIGATION_ELEMENT_ID } from '../components/BottomNavigation'
import { BREAKPOINTS } from '../components/ThemeContainer'
import { TtsContext } from '../components/TtsContainer'
import { TTS_PLAYER_ELEMENT_ID } from '../components/TtsPlayer'

export type WindowDimensionsType = {
  width: number
  height: number
  mobile: boolean
  headerHeight: number
  footerHeight: number
  scrollY: number
  documentHeight: number
  visibleFooterHeight: number
  ttsPlayerHeight: number
  bottomNavigationHeight: number | undefined
}

const getWindowDimensions = (): WindowDimensionsType => {
  const { innerWidth: width, innerHeight: height, scrollY } = window
  const header = document.querySelector('header')
  const headerHeight = header?.offsetHeight ?? 0
  const footer = document.querySelector('footer')
  const footerHeight = footer?.offsetHeight ?? 0
  const documentHeight = document.body.offsetHeight
  const ttsPlayer = document.getElementById(TTS_PLAYER_ELEMENT_ID)
  const ttsPlayerHeight = ttsPlayer?.getBoundingClientRect().height ?? 0
  const bottomNavigation = document.getElementById(BOTTOM_NAVIGATION_ELEMENT_ID)
  const bottomNavigationHeight = bottomNavigation?.getBoundingClientRect().height
  return {
    width,
    height,
    scrollY,
    mobile: width <= BREAKPOINTS.md,
    headerHeight,
    footerHeight,
    documentHeight,
    ttsPlayerHeight,
    bottomNavigationHeight,
    visibleFooterHeight: Math.max(0, height + scrollY + footerHeight - documentHeight),
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
