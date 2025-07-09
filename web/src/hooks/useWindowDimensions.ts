import { useTheme } from '@mui/material'
import { useState, useEffect } from 'react'

export type WindowDimensionsType = {
  width: number
  height: number
  viewportSmall: boolean
  footerHeight: number
  scrollY: number
  documentHeight: number
  visibleFooterHeight: number
}

const getWindowDimensions = (maxWidthViewportSmall: number): WindowDimensionsType => {
  const { innerWidth: width, innerHeight: height, scrollY } = window
  const footer = document.querySelector('footer')
  const footerHeight = footer?.offsetHeight ?? 0
  const documentHeight = document.body.offsetHeight
  return {
    width,
    height,
    scrollY,
    viewportSmall: width <= maxWidthViewportSmall,
    footerHeight,
    documentHeight,
    visibleFooterHeight: Math.max(0, height + scrollY + footerHeight - documentHeight),
  }
}

const useWindowDimensions = (): WindowDimensionsType => {
  const theme = useTheme()
  const maxWidthViewportSmall = theme.breakpoints.values.md
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions(maxWidthViewportSmall))

  useEffect(() => {
    // Observe changes to the DOM body and recalculate all window dimensions (e.g. for adding/removing the tts player)
    const resizeObserver = new ResizeObserver(() => setWindowDimensions(getWindowDimensions(maxWidthViewportSmall)))
    resizeObserver.observe(document.body)
    return () => resizeObserver.disconnect()
  }, [maxWidthViewportSmall])

  useEffect(() => {
    // Observe changes to the window sizes or the scroll position and recalculate all window dimensions
    const handleResize = () => setWindowDimensions(getWindowDimensions(maxWidthViewportSmall))
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleResize)
    }
  }, [maxWidthViewportSmall])

  return windowDimensions
}

export default useWindowDimensions
