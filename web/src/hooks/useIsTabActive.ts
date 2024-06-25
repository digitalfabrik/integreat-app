import { useCallback, useEffect, useState } from 'react'

const useIsTabActive = (): boolean => {
  const [isTabVisible, setIsTabVisible] = useState<boolean>(true)

  const handleVisibilityChange = useCallback(() => {
    setIsTabVisible(document.visibilityState === 'visible')
  }, [])

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [handleVisibilityChange])

  return isTabVisible
}

export default useIsTabActive
