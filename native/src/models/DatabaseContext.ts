class DatabaseContext {
  _regionCode: string | undefined
  _languageCode: string | null | undefined

  constructor(currentRegion?: string, currentLanguage?: string) {
    this._regionCode = currentRegion
    this._languageCode = currentLanguage
  }

  get regionCode(): string | null | undefined {
    return this._regionCode
  }

  get languageCode(): string | null | undefined {
    return this._languageCode
  }

  sameRegionAs(anotherContext: DatabaseContext | null | undefined): boolean {
    if (!anotherContext) {
      return false
    }

    return anotherContext.regionCode === this.regionCode
  }

  sameLanguageAs(anotherContext: DatabaseContext | null | undefined): boolean {
    if (!anotherContext) {
      return false
    }

    return anotherContext.languageCode === this.languageCode
  }

  equals(anotherContext: DatabaseContext | null | undefined): boolean {
    return this.sameRegionAs(anotherContext) && this.sameLanguageAs(anotherContext)
  }
}

export default DatabaseContext
