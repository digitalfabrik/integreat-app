import { DateTime } from 'luxon'

import parseHTML from '../../utils/parseHTML.js'
import Endpoint from '../Endpoint.js'
import EndpointBuilder from '../EndpointBuilder.js'
import TuNewsModel from '../models/TuNewsModel.js'
import { JsonTuNewsType } from '../types.js'

export const TU_NEWS_ENDPOINT_NAME = 'tuNews'
type ParamsType = {
  language: string
  page: number
  count: number
}
export default (baseUrl: string): Endpoint<ParamsType, TuNewsModel[]> =>
  new EndpointBuilder<ParamsType, TuNewsModel[]>(TU_NEWS_ENDPOINT_NAME)
    .withParamsToUrlMapper(
      (params: ParamsType): string => `${baseUrl}/v1/news/${params.language}?page=${params.page}&count=${params.count}`,
    )
    .withMapper((json: JsonTuNewsType[]): TuNewsModel[] =>
      json.map(
        (tuNews: JsonTuNewsType) =>
          new TuNewsModel({
            id: tuNews.id,
            title: tuNews.title,
            tags: tuNews.tags,
            lastUpdate: DateTime.fromISO(tuNews.display_date),
            content: parseHTML(tuNews.content),
            eNewsNo: tuNews.enewsno,
          }),
      ),
    )
    .build()
