import { useContext, useEffect, useState } from 'react'

import { BOTTOM_NAVIGATION_ELEMENT_ID } from '../components/BottomNavigation'
import { TOOLBAR_ELEMENT_ID } from '../components/CityContentToolbar'
import { BREAKPOINTS } from '../components/ThemeContainer'
import { TtsContext } from '../components/TtsContainer'
import { TTS_PLAYER_ELEMENT_ID } from '../components/TtsPlayer'

const bottomSheetHandleHeight = 40
const midSnapPercentage = 0.35
const mapIconsHeight = 60

type WindowDimensions = {
  width: number
  height: number
  scrollX: number
  scrollY: number
}

type BottomSheet = {
  snapPoints: {
    min: number
    medium: number
    large: number
    max: number
    all: number[]
  }
}

export type Dimensions = {
  window: WindowDimensions
  bottomSheet: BottomSheet

  headerHeight: number
  visibleFooterHeight: number
  ttsPlayerHeight: number
  bottomNavigationHeight: number | undefined
  toolbarWidth: number

  mobile: boolean
  desktop: boolean
  xsmall: boolean
  small: boolean
  medium: boolean
  large: boolean
  xlarge: boolean
}

const getDimensions = (): Dimensions => {
  const { innerWidth: width, innerHeight: height, scrollX, scrollY } = window
  const headerHeight = document.querySelector('header')?.offsetHeight ?? 0
  const ttsPlayerHeight = document.getElementById(TTS_PLAYER_ELEMENT_ID)?.getBoundingClientRect().height ?? 0
  const bottomNavigationHeight = document.getElementById(BOTTOM_NAVIGATION_ELEMENT_ID)?.getBoundingClientRect().height
  const toolbarWidth = document.getElementById(TOOLBAR_ELEMENT_ID)?.getBoundingClientRect().width ?? 0

  const footerHeight = document.querySelector('footer')?.offsetHeight ?? 0
  const documentHeight = document.body.offsetHeight
  const visibleFooterHeight = Math.max(0, height + scrollY + footerHeight - documentHeight)

  const snapPoints = {
    min: bottomSheetHandleHeight + (bottomNavigationHeight ?? 0),
    medium: height * midSnapPercentage,
    large: height - headerHeight - mapIconsHeight,
    max: height,
  }

  return {
    window: { width, height, scrollX, scrollY },
    bottomSheet: {
      snapPoints: {
        ...snapPoints,
        all: [snapPoints.min, snapPoints.medium, snapPoints.large, snapPoints.max],
      },
    },

    headerHeight,
    visibleFooterHeight,
    ttsPlayerHeight,
    bottomNavigationHeight,
    toolbarWidth,

    mobile: width <= BREAKPOINTS.md,
    desktop: width > BREAKPOINTS.md,
    xsmall: width < BREAKPOINTS.sm,
    small: width >= BREAKPOINTS.sm && width < BREAKPOINTS.md,
    medium: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
    large: width >= BREAKPOINTS.lg && width < BREAKPOINTS.xl,
    xlarge: width >= BREAKPOINTS.xl,
  }
}

const useDimensions = (): Dimensions => {
  const [dimensions, setDimensions] = useState(getDimensions())
  const { visible } = useContext(TtsContext)

  useEffect(() => {
    // Observe changes to the DOM body and recalculate all window dimensions (e.g. for adding/removing the tts player)
    const resizeObserver = new ResizeObserver(() => setDimensions(getDimensions()))
    resizeObserver.observe(document.body)
    return () => resizeObserver.disconnect()
  }, [visible])

  useEffect(() => {
    // Observe changes to the window sizes or the scroll position and recalculate all window dimensions
    const handleResize = () => setDimensions(getDimensions())
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleResize)
    }
  }, [])

  return dimensions
}

export default useDimensions
