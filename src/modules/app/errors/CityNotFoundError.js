// @flow

class CityNotFoundError extends Error {
  _city: string

  constructor (params: {city: string}) {
    super()
    this.message = 'not-found.city'
    this._city = params.city

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CityNotFoundError)
    }
  }

  get city (): string {
    return this._city
  }
}

export default CityNotFoundError
