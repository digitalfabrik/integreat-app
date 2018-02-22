import EndpointBuilder from '../EndpointBuilder'

import LanguageModel from '../models/LanguageModel'

export default new EndpointBuilder('languages')
  .withUrl('https://cms.integreat-app.de/{location}/{language}/wp-json/extensions/v0/languages/wpml')
  .withStateMapper().fromFunction((state) => ({
    location: state.router.params.location,
    language: 'de' /* German always exists in the backend and the available languages are not depended
                      on the language in which they are fetched */
  }))
  .withMapper(json => json
    .map(language => new LanguageModel(language.code, language.native_name))
    .sort((lang1, lang2) => lang1.code.localeCompare(lang2.code)))
  .build()
