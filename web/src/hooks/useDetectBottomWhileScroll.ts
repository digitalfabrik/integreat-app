import { useEffect, useState } from 'react'

const useDetectBottomWhileScroll = (): { isReachedBottom: boolean } => {
  const [isReachedBottom, setIsReachedBottom] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        setIsReachedBottom(true)
      } else {
        setIsReachedBottom(false)
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return {
    isReachedBottom,
  }
}

export default useDetectBottomWhileScroll
