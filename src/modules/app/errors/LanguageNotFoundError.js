// @flow

class LanguageNotFoundError extends Error {
  _language: string
  _city: string

  constructor (params: {city: string, language: string}) {
    super()
    this.message = 'language not found'
    this._city = params.city
    this._language = params.language
  }

  get language (): string {
    return this._language
  }

  get city (): string {
    return this._city
  }
}

export default LanguageNotFoundError
