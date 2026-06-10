import { NEWS_ALL_SOURCES_FILTER, NEWS_LOCAL_SOURCES_FILTER, NewsSourceFilter } from '../../constants'
import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import { AMAL_NEWS_SOURCE, API_VERSION, LOCAL_NEWS_SOURCE, NewsSource, TU_NEWS_SOURCE } from '../constants'
import mapNewsJson from '../mapping/mapNewsJson'
import NewsModel from '../models/NewsModel'
import { JsonNewsType } from '../types'
import { INITIAL_PAGE, PAGE_SIZE } from './hooks/usePaginatedLoadAsync'

export const NEWS_ENDPOINT_NAME = 'news'

const getNewsSourceQueryParam = (newsSourcesFilter?: NewsSourceFilter): string => {
  if (!newsSourcesFilter || newsSourcesFilter === NEWS_ALL_SOURCES_FILTER) {
    return ''
  }
  const newsSources: NewsSource[] =
    newsSourcesFilter === NEWS_LOCAL_SOURCES_FILTER ? [LOCAL_NEWS_SOURCE] : [TU_NEWS_SOURCE, AMAL_NEWS_SOURCE]
  return newsSources.map(newsSource => `&source=${newsSource}`).join()
}

type ParamsType = {
  region: string
  language: string
  page?: number
  newsSources?: NewsSourceFilter
}

const createNewsEndpoint = (baseUrl: string): Endpoint<ParamsType, NewsModel[]> =>
  new EndpointBuilder<ParamsType, NewsModel[]>(NEWS_ENDPOINT_NAME)
    .withParamsToUrlMapper(
      ({ region, language, page = INITIAL_PAGE, newsSources }: ParamsType): string =>
        `${baseUrl}/api/${API_VERSION}/${region}/${language}/news?page=${page}&count=${PAGE_SIZE}${getNewsSourceQueryParam(newsSources)}`,
    )
    .withMapper((json: JsonNewsType[]): NewsModel[] => json.map(mapNewsJson))
    .build()

export default createNewsEndpoint
