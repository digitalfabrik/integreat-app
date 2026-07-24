import Endpoint from '../Endpoint.ts'
import EndpointBuilder from '../EndpointBuilder.ts'
import { API_VERSION } from '../constants/index.ts'
import mapNewsJson from '../mapping/mapNewsJson.ts'
import NewsModel from '../models/NewsModel.ts'
import { JsonNewsType } from '../types.ts'

export const NEWS_ELEMENT_ENDPOINT_NAME = 'newsElement'

type ParamsType = {
  region: string
  language: string
  id: string
}

const createNewsElementEndpoint = (baseUrl: string): Endpoint<ParamsType, NewsModel> =>
  new EndpointBuilder<ParamsType, NewsModel>(NEWS_ELEMENT_ENDPOINT_NAME)
    .withParamsToUrlMapper(
      ({ region, language, id }: ParamsType): string =>
        `${baseUrl}/api/${API_VERSION}/${region}/${language}/news/${id}`,
    )
    .withMapper((json: JsonNewsType): NewsModel => mapNewsJson(json))
    .build()

export default createNewsElementEndpoint
