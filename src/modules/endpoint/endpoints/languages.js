// @flow

import LanguageModel from '../models/LanguageModel'
import { apiUrl } from '../constants'
import EndpointBuilder from '../EndpointBuilder'
import ParamMissingError from '../errors/ParamMissingError'
import type { EndpointParamsType, PayloadDataType } from '../../../flowTypes'

const LANGUAGES_ENDPOINT_NAME = 'languages'

export default new EndpointBuilder(LANGUAGES_ENDPOINT_NAME)
  .withParamsToUrlMapper((params: EndpointParamsType): string => {
    if (!params.city) {
      throw new ParamMissingError(LANGUAGES_ENDPOINT_NAME, 'city')
    }
    return `${apiUrl}/${params.city}/de/wp-json/extensions/v3/languages`
  })
  .withMapper((json: any): PayloadDataType => json
    .map(language => new LanguageModel(
      language.code,
      language.native_name
    ))
    .sort((lang1, lang2) => lang1.code.localeCompare(lang2.code))
  )
  .build()
