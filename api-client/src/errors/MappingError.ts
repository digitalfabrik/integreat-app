class MappingError extends Error {
  getMessage = (endpointName: string, message: string): string =>
    `MappingError: Failed to map the json for the ${endpointName} endpoint. ${message}`

  constructor(endpointName: string, message: string) {
    super()

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MappingError)
    }

    this.message = this.getMessage(endpointName, message)
  }
}

export default MappingError