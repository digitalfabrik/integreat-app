import { useState, useEffect } from 'react'
import dimensions from '../constants/dimensions';

type WindowDimensionsType = { width: number; height: number; viewportSmall: boolean }

const getWindowDimensions = (): WindowDimensionsType => {
  const { innerWidth: width, innerHeight: height } = window
  return {
    width,
    height,
    viewportSmall: width <= dimensions.maxWidthViewportSmall
  }
}

const useWindowDimensions = (): WindowDimensionsType => {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions(getWindowDimensions())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowDimensions
}

export default useWindowDimensions
