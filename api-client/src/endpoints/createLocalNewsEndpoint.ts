import { DateTime } from 'luxon'

import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import LocalNewsModel from '../models/LocalNewsModel'
import { JsonLocalNewsType } from '../types'

export const LOCAL_NEWS_ENDPOINT_NAME = 'localNews'
type ParamsType = {
  city: string
  language: string
}
export default (baseUrl: string): Endpoint<ParamsType, Array<LocalNewsModel>> =>
  new EndpointBuilder<ParamsType, Array<LocalNewsModel>>(LOCAL_NEWS_ENDPOINT_NAME)
    .withParamsToUrlMapper(
      (params: ParamsType): string =>
        `${baseUrl}/${params.city}/${params.language}/wp-json/extensions/v3/fcm/?channel=news`
    )
    .withMapper(
      (json: Array<JsonLocalNewsType>): Array<LocalNewsModel> =>
        json.map(
          (localNews: JsonLocalNewsType) =>
            new LocalNewsModel({
              id: localNews.id,
              timestamp: DateTime.fromJSDate(new Date(localNews.timestamp), { zone: 'GMT' }),
              title: localNews.title,
              content: localNews.message,
            })
        )
    )
    .build()
