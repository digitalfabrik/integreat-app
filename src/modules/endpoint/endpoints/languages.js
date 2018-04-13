// @flow

import LanguageModel from '../models/LanguageModel'
import { apiUrl } from '../constants'
import EndpointBuilder from '../EndpointBuilder'
import type { Params } from '../Endpoint'
import ParamMissingError from '../errors/ParamMissingError'

const LANGUAGES_ENDPOINT_NAME = 'languages'

export default new EndpointBuilder(LANGUAGES_ENDPOINT_NAME)
  .withParamsToUrlMapper((params: Params): string => {
    if (!params.city) {
      throw new ParamMissingError(LANGUAGES_ENDPOINT_NAME, 'city')
    }
    return `${apiUrl}/${params.city}/de/wp-json/extensions/v0/languages/wpml`
  })
  .withMapper((json: any): Array<LanguageModel> => json
    .map(language => new LanguageModel(language.code, language.native_name))
    .sort((lang1, lang2) => lang1.code.localeCompare(lang2.code))
  )
  .build()
