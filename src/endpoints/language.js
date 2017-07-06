import Endpoint from './Endpoint'
import LanguageModel from './models/LanguageModel'

export default new Endpoint(
  'languages',
  'https://cms.integreat-app.de/{location}/{language}/wp-json/extensions/v0/languages/wpml',
  json => {
    return json.map(language => new LanguageModel(language.code, language.native_name))
  },
  []
)
