import moment from 'moment-timezone'

import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import MappingError from '../errors/MappingError'
import NotFoundError from '../errors/NotFoundError'
import LocalNewsModel from '../models/LocalNewsModel'
import { LOCAL_NEWS_TYPE } from '../routes'
import { JsonLocalNewsType } from '../types'

export const LOCAL_NEWS_ELEMENT_ENDPOINT_NAME = 'localNewsElement'
type ParamsType = {
  city: string
  language: string
  id: string
}
export default (baseUrl: string): Endpoint<ParamsType, LocalNewsModel> =>
  new EndpointBuilder<ParamsType, LocalNewsModel>(LOCAL_NEWS_ELEMENT_ENDPOINT_NAME)
    .withParamsToUrlMapper(
      (params: ParamsType): string =>
        `${baseUrl}/${params.city}/${params.language}/wp-json/extensions/v3/fcm/?id=${params.id}`
    )
    .withMapper((localNews: Array<JsonLocalNewsType>, params: ParamsType): LocalNewsModel => {
      const localNewsModel = localNews[0]

      if (!localNewsModel) {
        throw new NotFoundError({ ...params, type: LOCAL_NEWS_TYPE })
      } else if (localNews.length > 1) {
        throw new MappingError(
          LOCAL_NEWS_ELEMENT_ENDPOINT_NAME,
          `Expected count of local news to be one. Received ${localNews.length} instead`
        )
      }

      const { id, timestamp, title, message } = localNewsModel
      return new LocalNewsModel({
        id,
        timestamp: moment.tz(timestamp, 'GMT'),
        title,
        message,
      })
    })
    .build()
