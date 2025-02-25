import { useState, useEffect } from 'react'

import dimensions from '../constants/dimensions'

export type WindowDimensionsType = {
  width: number
  height: number
  viewportSmall: boolean
  footerHeight: number
  scrollY: number
  documentHeight: number
}

export const getWindowDimensions = (): WindowDimensionsType => {
  const { innerWidth: width, innerHeight: height, scrollY } = window
  const footer = document.querySelector('footer')
  return {
    width,
    height,
    scrollY,
    viewportSmall: width <= dimensions.maxWidthViewportSmall,
    footerHeight: footer?.offsetHeight ?? 0,
    documentHeight: document.body.scrollHeight,
  }
}

const useWindowDimensions = (): WindowDimensionsType => {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => setWindowDimensions(getWindowDimensions()))
    resizeObserver.observe(document.body)
    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
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
