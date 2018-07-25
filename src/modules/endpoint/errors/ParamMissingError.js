// @flow

import ContentNotFoundError from '../../common/errors/ContentNotFoundError'

class ParamMissingError extends Error {
  getMessage = (endpointName: string, paramName: string): string =>
    `ParamMissingError: Failed to load the ${endpointName} endpoint because the ${paramName} is missing`

  constructor (endpointName: string, paramName: string) {
    super()
    this.message = this.getMessage(endpointName, paramName)

    // https://github.com/babel/babel/issues/3083
    /* eslint-disable */
    // $FlowFixMe
    this.constructor = ContentNotFoundError
    // $FlowFixMe
    this.__proto__ = ContentNotFoundError.prototype
    /* eslint-enable */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ParamMissingError)
    }
  }
}

export default ParamMissingError
