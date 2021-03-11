// @flow

class DatabaseContext {
  _cityCode: ?string
  _languageCode: ?string

  constructor(currentCity: ?string, currentLanguage: ?string) {
    this._cityCode = currentCity
    this._languageCode = currentLanguage
  }

  get cityCode(): ?string {
    return this._cityCode
  }

  get languageCode(): ?string {
    return this._languageCode
  }

  sameCityAs(anotherContext: ?DatabaseContext): boolean {
    if (!anotherContext) {
      return false
    }
    return anotherContext.cityCode === this.cityCode
  }

  sameLanguageAs(anotherContext: ?DatabaseContext): boolean {
    if (!anotherContext) {
      return false
    }
    return anotherContext.languageCode === this.languageCode
  }

  equals(anotherContext: ?DatabaseContext): boolean {
    return this.sameCityAs(anotherContext) && this.sameLanguageAs(anotherContext)
  }
}

export default DatabaseContext
