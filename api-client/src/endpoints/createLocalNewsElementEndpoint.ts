// @flow

import EndpointBuilder from '../EndpointBuilder'
import type { JsonLocalNewsType } from '../types'
import LocalNewsModel from '../models/LocalNewsModel'
import moment from 'moment-timezone'
import Endpoint from '../Endpoint'
import MappingError from '../errors/MappingError'
import NotFoundError from '../errors/NotFoundError'
import { LOCAL_NEWS_TYPE } from '../routes'

export const LOCAL_NEWS_ELEMENT_ENDPOINT_NAME = 'localNewsElement'

type ParamsType = {| city: string, language: string, id: string |}

export default (baseUrl: string): Endpoint<ParamsType, LocalNewsModel> =>
  new EndpointBuilder(LOCAL_NEWS_ELEMENT_ENDPOINT_NAME)
    .withParamsToUrlMapper(
      (params: ParamsType): string =>
        `${baseUrl}/${params.city}/${params.language}/wp-json/extensions/v3/fcm?id=${params.id}`
    )
    .withMapper((localNews: Array<JsonLocalNewsType>, params: ParamsType): LocalNewsModel => {
      const count = localNews.length
      if (count === 0) {
        throw new NotFoundError({ ...params, type: LOCAL_NEWS_TYPE })
      } else if (count > 1) {
        throw new MappingError(
          LOCAL_NEWS_ELEMENT_ENDPOINT_NAME,
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
