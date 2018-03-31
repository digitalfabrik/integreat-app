// @flow

class CityNotFoundError extends Error {
  _city: string

  constructor (params: {city: string}) {
    super()
    this.message = 'city not found'
    this._city = params.city
  }

  get city (): string {
    return this._city
  }
}

export default CityNotFoundError
