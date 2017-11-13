import EndpointBuilder from './EndpointBuilder'

import LanguageModel from './models/LanguageModel'

export default new EndpointBuilder('languages')
  .withUrl('https://cms.integreat-app.de/{location}/{language}/wp-json/extensions/v0/languages/wpml')
  .withStateMapper().fromFunction((state) => ({
    location: state.router.params.location,
    language: 'de'  // todo:  This forces that the languages are always fetched in german language. German always
                    //        exists in the backend -> a langauge switch always works
  }))
  .withStateMapper().fromArray(['location', 'language'], (state, paramName) => state.router.params[paramName])
  .withMapper(json => json.map(language => new LanguageModel(language.code, language.native_name)))
  .build()
