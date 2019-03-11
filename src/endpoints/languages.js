// @flow

import LanguageModel from '../models/LanguageModel'
import EndpointBuilder from '../EndpointBuilder'
import ParamMissingError from '../errors/ParamMissingError'
import type { JsonLanguageType } from '../types'
import Endpoint from '../Endpoint'

const LANGUAGES_ENDPOINT_NAME = 'languages'

type ParamsType = { city: ?string }

const endpoint: Endpoint<ParamsType, Array<LanguageModel>> = new EndpointBuilder(LANGUAGES_ENDPOINT_NAME)
  .withParamsToUrlMapper((apiUrl: string, params): string => {
    if (!params.city) {
      throw new ParamMissingError(LANGUAGES_ENDPOINT_NAME, 'city')
    }
    return `${apiUrl}/${params.city}/de/wp-json/extensions/v3/languages`
  })
  .withMapper((json: Array<JsonLanguageType>) => json
    .map(language => new LanguageModel(
      language.code,
      language.native_name
    ))
    .sort((lang1, lang2) => lang1.code.localeCompare(lang2.code))
  )
  .build()

export default endpoint
