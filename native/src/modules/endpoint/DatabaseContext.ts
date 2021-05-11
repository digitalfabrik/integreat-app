class DatabaseContext {
  _cityCode: string | undefined
  _languageCode: string | null | undefined

  constructor(currentCity?: string, currentLanguage?: string | null) {
    this._cityCode = currentCity
    this._languageCode = currentLanguage
  }

  get cityCode(): string | null | undefined {
    return this._cityCode
  }

  get languageCode(): string | null | undefined {
    return this._languageCode
  }

  sameCityAs(anotherContext: DatabaseContext | null | undefined): boolean {
    if (!anotherContext) {
      return false
    }

    return anotherContext.cityCode === this.cityCode
  }

  sameLanguageAs(anotherContext: DatabaseContext | null | undefined): boolean {
    if (!anotherContext) {
      return false
    }

    return anotherContext.languageCode === this.languageCode
  }

  equals(anotherContext: DatabaseContext | null | undefined): boolean {
    return this.sameCityAs(anotherContext) && this.sameLanguageAs(anotherContext)
  }
}

export default DatabaseContext
