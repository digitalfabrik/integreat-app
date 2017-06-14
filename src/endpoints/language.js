import Endpoint from './endpoint'

export class LanguageModel {
  constructor (code, name) {
    this._code = code
    this._name = name
  }

  get code () {
    return this._code
  }

  get name () {
    return this._name
  }
}

export default new Endpoint(
  'languages',
  'https://cms.integreat-app.de/{location}/{language}/wp-json/extensions/v0/languages/wpml',
  json => {
    return json.map(language => new LanguageModel(language.code, language.native_name))
  },
  []
)
