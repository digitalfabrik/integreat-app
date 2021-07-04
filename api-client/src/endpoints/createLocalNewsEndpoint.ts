import EndpointBuilder from '../EndpointBuilder'
import { JsonLocalNewsType } from '../types'
import LocalNewsModel from '../models/LocalNewsModel'
import moment from 'moment-timezone'
import Endpoint from '../Endpoint'
import { sanitize } from 'isomorphic-dompurify'

export const LOCAL_NEWS_ENDPOINT_NAME = 'localNews'
type ParamsType = {
  city: string
  language: string
}
export default (baseUrl: string): Endpoint<ParamsType, Array<LocalNewsModel>> =>
  new EndpointBuilder<ParamsType, Array<LocalNewsModel>>(LOCAL_NEWS_ENDPOINT_NAME)
    .withParamsToUrlMapper(
      (params: ParamsType): string =>
        `${baseUrl}/${params.city}/${params.language}/wp-json/extensions/v3/fcm?channel=news`
    )
    .withMapper(
      (json: Array<JsonLocalNewsType>): Array<LocalNewsModel> =>
        json.map((localNews: JsonLocalNewsType) => {
          return new LocalNewsModel({
            id: localNews.id,
            timestamp: moment.tz(localNews.timestamp, 'GMT'),
            title: localNews.title,
            message: sanitize(localNews.message)
          })
        })
    )
    .build()
