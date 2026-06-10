import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import { API_VERSION } from '../constants'
import mapNewsJson from '../mapping/mapNewsJson'
import NewsModel from '../models/NewsModel'
import { JsonNewsType } from '../types'

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
