import Endpoint from './Endpoint'
import LanguageModel from './models/LanguageModel'
import PropTypes from 'prop-types'

export default new Endpoint({
  name: 'languages',
  url: 'https://cms.integreat-app.de/{location}/{language}/wp-json/extensions/v0/languages/wpml',
  optionsPropType: PropTypes.shape({}),
  jsonToAny: json => {
    return json.map(language => new LanguageModel(language.code, language.native_name))
  },
  mapStateToOptions: (state) => ({
    location: state.router.params.location,
    language: 'de'  // todo:  This forces that the languages are always fetched in german language. German always
                    //        exists in the backend -> a langauge switch always works
  })
})
