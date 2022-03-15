import { useState, useEffect } from 'react'

const VIEWPORT_SMALL_THRESHOLD = 768

type WindowDimensionsType = { width: number; height: number; viewportSmall: boolean }

const getWindowDimensions = (): WindowDimensionsType => {
  const { innerWidth: width, innerHeight: height } = window
  return {
    width,
    height,
    viewportSmall: width < VIEWPORT_SMALL_THRESHOLD
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
