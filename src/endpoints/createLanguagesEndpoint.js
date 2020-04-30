// @flow

import LanguageModel from '../models/LanguageModel'
import EndpointBuilder from '../EndpointBuilder'
import ParamMissingError from '../errors/ParamMissingError'
import type { JsonLanguageType } from '../types'
import Endpoint from '../Endpoint'

export const LANGUAGES_ENDPOINT_NAME = 'languages'

type ParamsType = { city: ?string }

export default (baseUrl: string, isTunews: ?boolean): Endpoint<ParamsType, Array<LanguageModel>> =>
  new EndpointBuilder(LANGUAGES_ENDPOINT_NAME)
    .withParamsToUrlMapper(params => {
      if (!params.city) {
        throw new ParamMissingError(LANGUAGES_ENDPOINT_NAME, 'city')
      }
      if (isTunews) {
        return `${baseUrl}/v1/news/languages`
      }
      return `${baseUrl}/${params.city}/de/wp-json/extensions/v3/languages`
    })
    .withMapper((json: Array<JsonLanguageType>) => {
      return json
        .map(language => {
          if (isTunews) {
            return new LanguageModel(
              language.code,
              language.name
            )
          }
          return new LanguageModel(
            language.code,
            language.native_name
          )
        })
        .sort((lang1, lang2) => lang1.code.localeCompare(lang2.code))
    }
    )
    .build()
