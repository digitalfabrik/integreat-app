import EndpointBuilder from '../EndpointBuilder'

import LanguageModel from '../models/LanguageModel'

export default new EndpointBuilder('languages')
  .withStateToUrlMapper(state => `https://cms.integreat-app.de/${state.router.params.location}` +
  `/de/wp-json/extensions/v0/languages/wpml`)
  .withMapper(json => json
    .map(language => new LanguageModel(language.code, language.native_name))
    .sort((lang1, lang2) => lang1.code.localeCompare(lang2.code)))
  .build()
