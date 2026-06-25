import { DateTime } from 'luxon'

import parseHTML from '../../utils/parseHTML.ts'
import Endpoint from '../Endpoint.ts'
import EndpointBuilder from '../EndpointBuilder.ts'
import TuNewsModel from '../models/TuNewsModel.ts'
import { JsonTuNewsType } from '../types.ts'

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
