import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

const useScrollToTop = (): void => {
  const location = useLocation()
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [location])
}

export default useScrollToTop
