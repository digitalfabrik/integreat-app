import LanguageModel from '../models/LanguageModel'
import EndpointBuilder from '../EndpointBuilder'
import { JsonTunewsLanguageType } from '../types'
import Endpoint from '../Endpoint'
export const TUNEWS_LANGUAGES_ENDPOINT_NAME = 'tunewsLanguages'
export default (baseUrl: string): Endpoint<any, Array<LanguageModel>> =>
  new EndpointBuilder<any, Array<LanguageModel>>(TUNEWS_LANGUAGES_ENDPOINT_NAME)
    .withParamsToUrlMapper(() => {
      return `${baseUrl}/v1/news/languages`
    })
    .withMapper((json: Array<JsonTunewsLanguageType>) =>
      json
        .map((language: JsonTunewsLanguageType) => new LanguageModel(language.code, language.name))
        .sort((lang1, lang2) => lang1.code.localeCompare(lang2.code))
    )
    .build()
