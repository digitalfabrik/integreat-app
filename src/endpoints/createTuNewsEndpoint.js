// @flow

import EndpointBuilder from '../EndpointBuilder'
import type { JsonTuNewsType } from '../types'
import TuNewsModel from '../models/TuNewsModel'
import moment from 'moment-timezone'
import Endpoint from '../Endpoint'

export const TUNEWS_ENDPOINT_NAME = 'tunewsList'

type ParamsType = { language: string, page: number, count: number }

export default (baseUrl: string): Endpoint<ParamsType, Array<TuNewsModel>> => new EndpointBuilder(TUNEWS_ENDPOINT_NAME)
  .withParamsToUrlMapper((params: ParamsType): string =>
    `${baseUrl}/v1/news/${params.language}?page=${params.page}&count=${params.count}`
  )
  .withMapper((json: Array<JsonTuNewsType>): Array<TuNewsModel> => json
    .map((tuNews: JsonTuNewsType) => {
      return new TuNewsModel({
        id: tuNews.id,
        title: tuNews.title,
        tags: tuNews.tags,
        date: moment.tz(tuNews.date, 'GMT'),
        content: tuNews.content,
        enewsno: tuNews.enewsno
      })
    })
  )
  .build()
