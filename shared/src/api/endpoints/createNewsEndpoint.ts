import Endpoint from '../Endpoint.ts'
import EndpointBuilder from '../EndpointBuilder.ts'
import { API_VERSION } from '../constants/index.ts'
import mapNewsJson from '../mapping/mapNewsJson.ts'
import NewsModel from '../models/NewsModel.ts'
import { JsonNewsType } from '../types.ts'

export const NEWS_ENDPOINT_NAME = 'news'

type ParamsType = {
  region: string
  language: string
}

const createNewsEndpoint = (baseUrl: string): Endpoint<ParamsType, NewsModel[]> =>
  new EndpointBuilder<ParamsType, NewsModel[]>(NEWS_ENDPOINT_NAME)
    .withParamsToUrlMapper(
      ({ region, language }: ParamsType): string => `${baseUrl}/api/${API_VERSION}/${region}/${language}/news`,
    )
    .withMapper((json: JsonNewsType[]): NewsModel[] => json.map(mapNewsJson))
    .build()

export default createNewsEndpoint
