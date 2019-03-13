// @flow

class MemoryDatabaseContext {
  _cityCode: string
  _languageCode: string

  constructor (currentCity: string, currentLanguage: string) {
    this._cityCode = currentCity
    this._languageCode = currentLanguage
  }

  get cityCode (): string {
    return this._cityCode
  }

  get languageCode (): string {
    return this._languageCode
  }
}

export default MemoryDatabaseContext
