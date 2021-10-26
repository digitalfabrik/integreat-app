import { useEffect } from 'react'

import { logError } from '../utils/helpers'

const useLogError = (error: Error | null): void => {
  useEffect(() => {
    if (error !== null) {
      logError(error)
    }
  }, [error])
}

export default useLogError
