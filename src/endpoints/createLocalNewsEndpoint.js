// @flow

import EndpointBuilder from '../EndpointBuilder'
import type { JsonLocalNewsType } from '../types'
import LocalNewsModel from '../models/LocalNewsModel'
import moment from 'moment-timezone'
import Endpoint from '../Endpoint'

export const LOCALNEWS_ENDPOINT_NAME = 'news'

type ParamsType = { city: string, language: string, channel: string }

export default (baseUrl: string): Endpoint<ParamsType, Array<LocalNewsModel>> =>
  new EndpointBuilder(LOCALNEWS_ENDPOINT_NAME)
    .withParamsToUrlMapper((params: ParamsType): string =>
      `${baseUrl}/${params.city}/${params.language}/wp-json/extensions/v3/fcm?channel=news`
    )
    .withMapper((json: Array<JsonLocalNewsType>): Array<LocalNewsModel> => json
      .map((localNews: JsonLocalNewsType) => {
        return new LocalNewsModel({
          timestamp: moment.tz(localNews.timestamp, 'GMT'),
          title: localNews.title,
          message: localNews.message
        })
      })
    )
    .build()
