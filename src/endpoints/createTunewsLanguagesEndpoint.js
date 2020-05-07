// @flow

import LanguageModel from '../models/LanguageModel'
import EndpointBuilder from '../EndpointBuilder'
import ParamMissingError from '../errors/ParamMissingError'
import MappingError from '../errors/MappingError'
import type { JsonLanguageType } from '../types'
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
    .withMapper((json: Array<JsonLanguageType>) => {
      return json
        .map(language => {
          if (!language.name) {
            throw new MappingError(TUNEWS_LANGUAGES_ENDPOINT_NAME, `Unexpected json format. Response did not contain ${language.name}`)
          }
          return new LanguageModel(
            language.code,
            language.name
          )
        })
        .sort((lang1, lang2) => lang1.code.localeCompare(lang2.code))
    })
    .build()
