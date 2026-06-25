import Endpoint from '../Endpoint.ts'
import EndpointBuilder from '../EndpointBuilder.ts'
import LanguageModel from '../models/LanguageModel.ts'
import { JsonTuNewsLanguageType } from '../types.ts'

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
