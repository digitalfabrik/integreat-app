import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import LanguageModel from '../models/LanguageModel'
import { JsonLanguageType } from '../types'

export const LANGUAGES_ENDPOINT_NAME = 'languages'

type ParamsType = {
  city: string
}

export default (baseUrl: string): Endpoint<ParamsType, Array<LanguageModel>> =>
  new EndpointBuilder<ParamsType, Array<LanguageModel>>(LANGUAGES_ENDPOINT_NAME)
    .withParamsToUrlMapper(params => `${baseUrl}/${params.city}/de/wp-json/extensions/v3/languages/`)
    .withMapper((json: Array<JsonLanguageType>) =>
      json
        .map((language: JsonLanguageType) => new LanguageModel(language.code, language.native_name, language.dir))
        .sort((lang1, lang2) => lang1.code.localeCompare(lang2.code))
    )
    .build()
