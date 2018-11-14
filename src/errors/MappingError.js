// @flow

class MappingError extends Error {
  getMessage = (endpointName: string, message: string): string =>
    `MappingError: Failed to map the json for the ${endpointName} endpoint. ${message}`

  constructor (endpointName: string, message: string) {
    super()
    this.message = this.getMessage(endpointName, message)

    // https://github.com/babel/babel/issues/3083
    /* eslint-disable */
    // $FlowFixMe
    this.constructor = MappingError
    // $FlowFixMe
    this.__proto__ = MappingError.prototype
    /* eslint-enable */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MappingError)
    }
  }
}

export default MappingError
