import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import { API_VERSION } from '../constants'
import mapNewsJson from '../mapping/mapNewsJson'
import NewsModel from '../models/NewsModel'
import { JsonNewsType } from '../types'
import { INITIAL_PAGE, PAGE_SIZE } from './hooks/usePaginatedLoadAsync'

export const NEWS_ENDPOINT_NAME = 'news'

type ParamsType = {
  region: string
  language: string
  page?: number
}

const createNewsEndpoint = (baseUrl: string): Endpoint<ParamsType, NewsModel[]> =>
  new EndpointBuilder<ParamsType, NewsModel[]>(NEWS_ENDPOINT_NAME)
    .withParamsToUrlMapper(
      ({ region, language, page }: ParamsType): string =>
        `${baseUrl}/api/${API_VERSION}/${region}/${language}/news?page=${page ?? INITIAL_PAGE}&count=${PAGE_SIZE}`,
    )
    .withMapper((json: JsonNewsType[]): NewsModel[] => json.map(mapNewsJson))
    .build()

export default createNewsEndpoint
