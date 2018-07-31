// @flow

class CityNotFoundError extends Error {
  _city: string

  constructor (params: {city: string}) {
    super()
    this.message = 'not-found.city'
    this._city = params.city

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

  get city (): string {
    return this._city
  }
}

export default CityNotFoundError
