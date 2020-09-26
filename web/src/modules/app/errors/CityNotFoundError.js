// @flow

class CityNotFoundError extends Error {
  constructor () {
    super()
    this.message = 'notFound.city'

    // https://github.com/babel/babel/issues/3083
    /* eslint-disable */
    // $FlowFixMe
    this.constructor = CityNotFoundError
    // $FlowFixMe
    this.__proto__ = CityNotFoundError.prototype
    /* eslint-enable */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CityNotFoundError)
    }
  }
}

export default CityNotFoundError
