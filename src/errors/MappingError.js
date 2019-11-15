// @flow

class MappingError extends Error {
  getMessage = (endpointName: string, message: string): string =>
    `MappingError: Failed to map the json for the ${endpointName} endpoint. ${message}`

  constructor (endpointName: string, message: string) {
    super()
    this.message = this.getMessage(endpointName, message)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MappingError)
    }
  }
}

export default MappingError
