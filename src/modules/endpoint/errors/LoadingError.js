// @flow

import ContentNotFoundError from '../../common/errors/ContentNotFoundError'

class LoadingError extends Error {
  getMessage = (endpointName: string, message: ?string): string =>
    `LoadingError: Failed to load the request for the ${endpointName} endpoint. ${message || ''}`

  constructor (params: {endpointName: string, message: string}) {
    super()
    this.message = this.getMessage(params.endpointName, params.message)

    // https://github.com/babel/babel/issues/3083
    /* eslint-disable */
    // $FlowFixMe
    this.constructor = ContentNotFoundError
    // $FlowFixMe
    this.__proto__ = ContentNotFoundError.prototype
    /* eslint-enable */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LoadingError)
    }
  }
}

export default LoadingError
