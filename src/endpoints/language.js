import { endpoint } from './EndpointBuilder'

import LanguageModel from './models/LanguageModel'

export default endpoint('languages')
  .withUrl('https://cms.integreat-app.de/{location}/{language}/wp-json/extensions/v0/languages/wpml')
  .withMapper(json => json.map(language => new LanguageModel(language.code, language.native_name)))
  .withRefetchLogic(() => false)
  .withStateMapper((state) => ({
    location: state.router.params.location,
    language: 'de'  // todo:  This forces that the languages are always fetched in german language. German always
                    //        exists in the backend -> a langauge switch always works
  }))
  .build()
