import Endpoint from '../Endpoint.ts'
import EndpointBuilder from '../EndpointBuilder.ts'
import { JsonExtractAnswerType } from '../types.ts'

export const EXTRACT_ANSWER_ENDPOINT_NAME = 'extractAnswer'

type ParamsType = {
  message: string
  languageCode: string
  regionCode: string
}

export type ExtractAnswerReturn = {
  answer: string
}

export default (baseUrl: string): Endpoint<ParamsType, ExtractAnswerReturn> =>
  new EndpointBuilder<ParamsType, ExtractAnswerReturn>(EXTRACT_ANSWER_ENDPOINT_NAME)
    .withParamsToUrlMapper(() => `${baseUrl}/chatanswers/extract_answer/`)
    .withParamsToBodyMapper((params: ParamsType): string =>
      JSON.stringify({ message: params.message, language: params.languageCode, region: params.regionCode }),
    )
    .withMapper((json: JsonExtractAnswerType): ExtractAnswerReturn => {
      if (json.status === 'error') {
        throw new Error(json.message)
      }
      return { answer: json.answer }
    })
    .build()
