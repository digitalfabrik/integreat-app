import { DateTime } from 'luxon'

import { LOCAL_NEWS_TYPE } from '../../routes'
import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import { API_VERSION } from '../constants'
import MappingError from '../errors/MappingError'
import NotFoundError from '../errors/NotFoundError'
import { mapNewsAvailableLanguages } from '../mapping/mapAvailableLanguages'
import LocalNewsModel from '../models/LocalNewsModel'
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
        `${baseUrl}/api/${API_VERSION}/${params.city}/${params.language}/fcm/?id=${params.id}`,
    )
    .withMapper((localNews: JsonLocalNewsType[], params: ParamsType): LocalNewsModel => {
      const localNewsModel = localNews[0]

      if (!localNewsModel) {
        throw new NotFoundError({ ...params, type: LOCAL_NEWS_TYPE })
      } else if (localNews.length > 1) {
        throw new MappingError(
          LOCAL_NEWS_ELEMENT_ENDPOINT_NAME,
          `Expected count of local news to be one. Received ${localNews.length} instead`,
        )
      }

      return new LocalNewsModel({
        id: localNewsModel.id,
        timestamp: DateTime.fromISO(localNewsModel.display_date),
        title: localNewsModel.title,
        content: localNewsModel.message,
        availableLanguages: mapNewsAvailableLanguages(localNewsModel.available_languages),
      })
    })
    .build()
