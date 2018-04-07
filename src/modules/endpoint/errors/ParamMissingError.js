// @flow

import LoadingError from './LoadingError'

class ParamMissingError extends Error {
  getMessage = (endpointName: string, paramName: string): string =>
    `Failed to load the ${endpointName} endpoint because the ${paramName} is missing`

  constructor (endpointName: string, paramName: string) {
    super()
    this.message = this.getMessage(endpointName, paramName)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LoadingError)
    }
  }
}

export default ParamMissingError
