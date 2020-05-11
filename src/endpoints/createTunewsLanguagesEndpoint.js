// @flow

import LanguageModel from '../models/LanguageModel'
import EndpointBuilder from '../EndpointBuilder'
import ParamMissingError from '../errors/ParamMissingError'
import type { JsonTunewsLanguageType } from '../types'
import Endpoint from '../Endpoint'

export const TUNEWS_LANGUAGES_ENDPOINT_NAME = 'languages'

type ParamsType = { city: ?string }

export default (baseUrl: string): Endpoint<ParamsType, Array<LanguageModel>> =>
  new EndpointBuilder(TUNEWS_LANGUAGES_ENDPOINT_NAME)
    .withParamsToUrlMapper(params => {
      if (!params.city) {
        throw new ParamMissingError(TUNEWS_LANGUAGES_ENDPOINT_NAME, 'city')
      }
      return `${baseUrl}/v1/news/languages`
    })
    .withMapper((json: Array<JsonTunewsLanguageType>) => json
      .map(language => new LanguageModel(
        language.code,
        language.name
      ))
      .sort((lang1, lang2) => lang1.code.localeCompare(lang2.code))
    )
    .build()
