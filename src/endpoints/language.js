import Endpoint from './Endpoint'
import LanguageModel from './models/LanguageModel'
import PropTypes from 'prop-types'

export default new Endpoint({
  name: 'languages',
  url: 'https://cms.integreat-app.de/{location}/{language}/wp-json/extensions/v0/languages/wpml',
  optionsPropType: PropTypes.shape({
    location: PropTypes.string.isRequired
  }),
  jsonToAny: json => {
    if (!json) {
      return []
    }
    return json.map(language => new LanguageModel(language.code, language.native_name))
  },
  mapOptionsToUrlParams: (options) => ({
    location: options.location,
    language: 'de'  // todo:  This forces that the languages are always fetched in german language. German always
                    //        exists in the backend -> a langauge switch always works
  })
})
