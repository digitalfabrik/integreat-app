// @flow

import EndpointBuilder from '../EndpointBuilder'
import type { JsonTunewsType } from '../types'
import TunewsModel from '../models/TunewsModel'
import moment from 'moment-timezone'
import Endpoint from '../Endpoint'

export const TUNEWS_ELEMENT_ENDPOINT_NAME = 'tunewsElement'

type ParamsType = { id: number }

export default (baseUrl: string): Endpoint<ParamsType, TunewsModel> => new EndpointBuilder(TUNEWS_ELEMENT_ENDPOINT_NAME)
  .withParamsToUrlMapper((params: ParamsType): string =>
    `${baseUrl}/v1/news/${params.id}`
  )
  .withMapper((json: JsonTunewsType): TunewsModel => new TunewsModel({
    id: json.id,
    title: json.title,
    tags: json.tags,
    date: moment.tz(json.date, 'GMT'),
    content: json.content,
    eNewsNo: json.enewsno
  })
  )
  .build()
