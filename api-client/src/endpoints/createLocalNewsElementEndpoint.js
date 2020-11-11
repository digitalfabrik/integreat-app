// @flow

import EndpointBuilder from '../EndpointBuilder'
import type { JsonLocalNewsType } from '../types'
import LocalNewsModel from '../models/LocalNewsModel'
import moment from 'moment-timezone'
import Endpoint from '../Endpoint'
import MappingError from '../errors/MappingError'

export const LOCALNEWS_ELEMENT_ENDPOINT_NAME = 'localNewsElement'

type ParamsType = { city: string, language: string, id: number }

export default (
  baseUrl: string
): Endpoint<ParamsType, LocalNewsModel> =>
  new EndpointBuilder(LOCALNEWS_ELEMENT_ENDPOINT_NAME)
    .withParamsToUrlMapper(
      (params: ParamsType): string =>
        `${baseUrl}/${params.city}/${params.language}/wp-json/extensions/v3/fcm?id=${params.id}`
    )
    .withMapper((localNews: Array<JsonLocalNewsType>): LocalNewsModel => {
      const count = localNews.length
      if (count !== 1) {
        throw new MappingError(
          LOCALNEWS_ELEMENT_ENDPOINT_NAME,
          `Expected count of local news to be one. Received ${count} instead`
        )
      }
      const { id, timestamp, title, message } = localNews[0]
      return new LocalNewsModel({
        id,
        timestamp: moment.tz(timestamp, 'GMT'),
        title,
        message
      })
    })
    .build()
