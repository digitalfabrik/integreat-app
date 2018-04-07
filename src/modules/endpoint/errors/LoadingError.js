// @flow

class LoadingError extends Error {
  getMessage = (endpointName: string, message: ?string): string =>
    `Failed to load the request for the ${endpointName} endpoint. ${message || ''}`

  constructor (params: {endpointName: string, message: string}) {
    super()
    this.message = this.getMessage(params.endpointName, params.message)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LoadingError)
    }
  }
}

export default LoadingError
