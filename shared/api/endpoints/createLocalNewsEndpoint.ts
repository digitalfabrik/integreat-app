import { DateTime } from 'luxon'

import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import { API_VERSION } from '../constants'
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
        `${baseUrl}/api/${API_VERSION}/${params.city}/${params.language}/fcm/?channel=news`,
    )
    .withMapper(
      (json: Array<JsonLocalNewsType>): Array<LocalNewsModel> =>
        json.map(
          (localNews: JsonLocalNewsType) =>
            new LocalNewsModel({
              id: localNews.id,
              timestamp: DateTime.fromISO(localNews.timestamp),
              title: localNews.title,
              content: localNews.message,
              availableLanguages: localNews.available_languages,
            }),
        ),
    )
    .build()
