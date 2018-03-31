// @flow

import LoadingError from './LoadingError'

class MappingError extends Error {
  _endpointName: string

  getMessage = (endpointName: string, message: string): string =>
    `Failed to map the json for the ${endpointName} endpoint. ${message}`

  constructor (endpointName: string, message: string) {
    super()
    this.message = this.getMessage(endpointName, message)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LoadingError)
    }
  }

  get endpointName (): string {
    return this._endpointName
  }
}

export default MappingError
