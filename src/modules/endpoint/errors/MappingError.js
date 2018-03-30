// @flow

class MappingError extends Error {
  _endpointName: string

  getMessage = (endpointName: string, message: string): string =>
    `Failed to map the json for the ${endpointName} endpoint. ${message}`

  constructor (endpointName: string, message: string) {
    super()
    this.message = this.getMessage(endpointName, message)
  }

  get endpointName (): string {
    return this._endpointName
  }
}

export default MappingError
