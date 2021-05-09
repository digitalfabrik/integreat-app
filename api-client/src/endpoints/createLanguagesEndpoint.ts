import LanguageModel from '../models/LanguageModel'
import EndpointBuilder from '../EndpointBuilder'
import ParamMissingError from '../errors/ParamMissingError'
import type { JsonLanguageType } from '../types'
import Endpoint from '../Endpoint'
export const LANGUAGES_ENDPOINT_NAME = 'languages'
type ParamsType = {
  city: string | null | undefined
}
export default (baseUrl: string): Endpoint<ParamsType, Array<LanguageModel>> =>
  new EndpointBuilder(LANGUAGES_ENDPOINT_NAME)
    .withParamsToUrlMapper(params => {
      if (!params.city) {
        throw new ParamMissingError(LANGUAGES_ENDPOINT_NAME, 'city')
      }

      return `${baseUrl}/${params.city}/de/wp-json/extensions/v3/languages`
    })
    .withMapper((json: Array<JsonLanguageType>) =>
      json
        .map((language: JsonLanguageType) => new LanguageModel(language.code, language.native_name, language.dir))
        .sort((lang1, lang2) => lang1.code.localeCompare(lang2.code))
    )
    .build()