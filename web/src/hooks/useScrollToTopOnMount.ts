import { useEffect } from 'react'

const useScrollToTopOnMount = (): void => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
}

export default useScrollToTopOnMount
