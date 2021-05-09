// @flow

class ParamMissingError extends Error {
  getMessage = (endpointName: string, paramName: string): string =>
    `ParamMissingError: Failed to load the ${endpointName} endpoint because the ${paramName} is missing`

  constructor(endpointName: string, paramName: string) {
    super()

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ParamMissingError)
    }

    this.message = this.getMessage(endpointName, paramName)
  }
}

export default ParamMissingError
