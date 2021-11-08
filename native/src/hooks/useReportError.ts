import { useEffect } from 'react'

import { reportError } from '../utils/sentry'

const useReportError = (error: Error | null): void => {
  useEffect(() => {
    if (error !== null) {
      reportError(error)
    }
  }, [error])
}

export default useReportError
