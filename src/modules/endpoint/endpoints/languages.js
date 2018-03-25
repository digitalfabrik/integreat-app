// @flow

import LanguageModel from '../models/LanguageModel'
import { apiUrl } from '../constants'
import EndpointBuilder from '../EndpointBuilder'
import type { Params } from '../Endpoint'

export default new EndpointBuilder('languages')
  .withParamsToUrlMapper((params: Params): string => `${apiUrl}/${params.city}/de/wp-json/extensions/v0/languages/wpml`)
  .withMapper((json: any): Array<LanguageModel> => json
    .map(language => new LanguageModel(language.code, language.native_name))
    .sort((lang1, lang2) => lang1.code.localeCompare(lang2.code))
  )
  .build()
