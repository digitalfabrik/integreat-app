// @flow

import EndpointBuilder from '../EndpointBuilder'
import type { JsonTuNewsType } from '../types'
import TuNewsModel from '../models/TuNewsModel'
import moment from 'moment-timezone'
import Endpoint from '../Endpoint'

export const TUNEWS_ELEMENT_ENDPOINT_NAME = 'tunewsElement'

type ParamsType = { id: number }

export default (baseUrl: string): Endpoint<ParamsType, TuNewsModel> => new EndpointBuilder(TUNEWS_ELEMENT_ENDPOINT_NAME)
  .withParamsToUrlMapper((params: ParamsType): string =>
    `${baseUrl}/v1/news/${params.id}`
  )
  .withMapper((json: JsonTuNewsType): TuNewsModel => new TuNewsModel({
    id: json.id,
    title: json.title,
    tags: json.tags,
    date: moment.tz(json.date, 'GMT'),
    content: json.content,
    enewsno: json.enewsno
  })
  )
  .build()
