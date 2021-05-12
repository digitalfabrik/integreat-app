import LanguageModel from '../models/LanguageModel'

const languages = [
  new LanguageModel('en', 'English'),
  new LanguageModel('de', 'Deutsch'),
  new LanguageModel('ar', 'اَللُّغَةُ اَلْعَرَبِيَّة')
]

class LanguageModelBuilder {
  _languagesCount: number

  constructor(languagesCount: number) {
    this._languagesCount = languagesCount

    if (this._languagesCount > languages.length) {
      throw new Error(`Only ${languages.length} languages models can be created`)
    }
  }

  build(): Array<LanguageModel> {
    return languages.slice(0, this._languagesCount)
  }
}

export default LanguageModelBuilder
