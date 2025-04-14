import { useState, useEffect } from 'react'

import dimensions from '../constants/dimensions'

export type WindowDimensionsType = {
  width: number
  height: number
  viewportSmall: boolean
  footerHeight: number
  scrollY: number
  documentHeight: number
  visibleFooterHeight: number
}

export const getWindowDimensions = (): WindowDimensionsType => {
  const { innerWidth: width, innerHeight: height, scrollY } = window
  const footer = document.querySelector('footer')
  const footerHeight = footer?.offsetHeight ?? 0
  const documentHeight = document.body.offsetHeight
  return {
    width,
    height,
    scrollY,
    viewportSmall: width <= dimensions.maxWidthViewportSmall,
    footerHeight,
    documentHeight,
    visibleFooterHeight: Math.max(0, height + scrollY + footerHeight - documentHeight),
  }
}

const useWindowDimensions = (): WindowDimensionsType => {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())

  useEffect(() => {
    // Observe changes to the DOM body and recalculate all window dimensions (e.g. for adding/removing the tts player)
    const resizeObserver = new ResizeObserver(() => setWindowDimensions(getWindowDimensions()))
    resizeObserver.observe(document.body)
    return () => resizeObserver.disconnect()
  }, [])

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
