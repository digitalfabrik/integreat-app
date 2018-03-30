// @flow

class LoadingError extends Error {
  _endpointName: string

  getMessage = (endpointName: string, message: ?string) =>
    `Failed to load the request for the ${endpointName} endpoint. ${message || ''}`

  constructor (params: {endpointName: string, message: string}) {
    super()
    this.message = this.getMessage(params.endpointName, params.message)
    this._endpointName = params.endpointName
  }

  get endpointName (): string {
    return this._endpointName
  }
}

export default LoadingError
