import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import LanguageModel from '../models/LanguageModel'
import { JsonTunewsLanguageType } from '../types'

export const TUNEWS_LANGUAGES_ENDPOINT_NAME = 'tunewsLanguages'

export default (baseUrl: string): Endpoint<void, Array<LanguageModel>> =>
  new EndpointBuilder<void, Array<LanguageModel>>(TUNEWS_LANGUAGES_ENDPOINT_NAME)
    .withParamsToUrlMapper(() => {
      return `${baseUrl}/v1/news/languages`
    })
    .withMapper((json: Array<JsonTunewsLanguageType>) =>
      json
        .map((language: JsonTunewsLanguageType) => new LanguageModel(language.code, language.name))
        .sort((lang1, lang2) => lang1.code.localeCompare(lang2.code))
    )
    .build()
