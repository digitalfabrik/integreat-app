import Endpoint from './Endpoint'
import LanguageModel from './models/LanguageModel'

export default new Endpoint(
  'languages',
  'https://cms.integreat-app.de/{location}/{language}/wp-json/extensions/v0/languages/wpml',
  json => {
    return json.map(language => new LanguageModel(language.code, language.native_name))
  },
  [],
  () => ({}),
  (props) => {
    return {
      location: props.location,
      language: 'de'  // todo:  This forces that the languages are always fetched in german language. German always
                      //        exists in the backend -> a langauge switch always works
    }
  }
)
