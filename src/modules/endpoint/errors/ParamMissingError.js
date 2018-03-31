// @flow

import LoadingError from './LoadingError'

class ParamMissingError extends Error {
  _endpointName: string
  _paramName: string

  getMessage = (endpointName: string, paramName: string): string =>
    `Failed to load the ${endpointName} endpoint because the ${paramName} is missing`

  constructor (endpointName: string, paramName: string) {
    super()
    this.message = this.getMessage(endpointName, paramName)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LoadingError)
    }
  }

  get endpointName (): string {
    return this._endpointName
  }

  get paramName (): string {
    return this._paramName
  }
}

export default ParamMissingError
