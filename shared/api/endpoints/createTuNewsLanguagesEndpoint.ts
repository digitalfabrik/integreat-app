import Endpoint from '../Endpoint.js'
import EndpointBuilder from '../EndpointBuilder.js'
import LanguageModel from '../models/LanguageModel.js'
import { JsonTuNewsLanguageType } from '../types.js'

export const TU_NEWS_LANGUAGES_ENDPOINT_NAME = 'tuNewsLanguages'

export default (baseUrl: string): Endpoint<void, LanguageModel[]> =>
  new EndpointBuilder<void, LanguageModel[]>(TU_NEWS_LANGUAGES_ENDPOINT_NAME)
    .withParamsToUrlMapper(() => `${baseUrl}/v1/news/languages`)
    .withMapper((json: JsonTuNewsLanguageType[]) =>
      json
        .map((language: JsonTuNewsLanguageType) => new LanguageModel(language.code, language.name))
        .sort((lang1, lang2) => lang1.code.localeCompare(lang2.code)),
    )
    .build()
