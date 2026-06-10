import { NewsSourceFilter } from '../../constants/index.ts'
import { newsFilterToSources } from '../../utils/news.ts'
import Endpoint from '../Endpoint.ts'
import EndpointBuilder from '../EndpointBuilder.ts'
import { API_VERSION } from '../constants/index.ts'
import mapNewsJson from '../mapping/mapNewsJson.ts'
import NewsModel from '../models/NewsModel.ts'
import { JsonNewsType } from '../types.ts'
import { INITIAL_PAGE, PAGE_SIZE } from './hooks/usePaginatedLoadAsync.ts'

export const NEWS_ENDPOINT_NAME = 'news'

type ParamsType = {
  region: string
  language: string
  page?: number
  newsSourceFilter?: NewsSourceFilter
}

const createNewsEndpoint = (baseUrl: string): Endpoint<ParamsType, NewsModel[]> =>
  new EndpointBuilder<ParamsType, NewsModel[]>(NEWS_ENDPOINT_NAME)
    .withParamsToUrlMapper(({ region, language, page = INITIAL_PAGE, newsSourceFilter }: ParamsType): string => {
      const sources = newsFilterToSources(newsSourceFilter)
      const sourceFilter = sources?.map(source => `&source=${source}`).join('') ?? ''
      return `${baseUrl}/api/${API_VERSION}/${region}/${language}/news?page=${page}&count=${PAGE_SIZE}${sourceFilter}`
    })
    .withMapper((json: JsonNewsType[]): NewsModel[] => json.map(mapNewsJson))
    .build()

export default createNewsEndpoint
