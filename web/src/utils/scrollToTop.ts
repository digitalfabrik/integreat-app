import { useEffect } from 'react'

const ScrollToTopOnMount = (): null => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return null
}

export default ScrollToTopOnMount
