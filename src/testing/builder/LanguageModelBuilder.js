// @flow

import { LanguageModel } from '@integreat-app/integreat-api-client'

const languages = [
  new LanguageModel('en', 'English'),
  new LanguageModel('de', 'Deutsch')
]

class LanguageModelBuilder {
  _languagesCount: number

  constructor (citiesCount: number) {
    if (this._languagesCount > languages.length) {
      throw new Error(`Only ${languages.length} languages models can be created`)
    }
    this._languagesCount = citiesCount
  }

  build (): Array<LanguageModel> {
    return languages.slice(0, this._languagesCount)
  }
}

export default LanguageModelBuilder
