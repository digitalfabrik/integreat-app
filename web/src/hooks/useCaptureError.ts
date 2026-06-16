import { useEffect } from 'react'

import { captureError } from '../utils/sentry'

const useCaptureError = (error: Error | null): void => {
  useEffect(() => {
    if (error !== null) {
      captureError(error).catch()
    }
  }, [error])
}

export default useCaptureError
