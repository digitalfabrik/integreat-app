import { DateTime } from 'luxon'

import Endpoint from '../Endpoint.ts'
import EndpointBuilder from '../EndpointBuilder.ts'
import { API_VERSION } from '../constants/index.ts'
import { mapNewsAvailableLanguages } from '../mapping/mapAvailableLanguages.ts'
import LocalNewsModel from '../models/LocalNewsModel.ts'
import { JsonLocalNewsType } from '../types.ts'

export const LOCAL_NEWS_ENDPOINT_NAME = 'localNews'
type ParamsType = {
  region: string
  language: string
}
export default (baseUrl: string): Endpoint<ParamsType, LocalNewsModel[]> =>
  new EndpointBuilder<ParamsType, LocalNewsModel[]>(LOCAL_NEWS_ENDPOINT_NAME)
    .withParamsToUrlMapper(
      (params: ParamsType): string =>
        `${baseUrl}/api/${API_VERSION}/${params.region}/${params.language}/fcm/?channel=news`,
    )
    .withMapper((json: JsonLocalNewsType[]): LocalNewsModel[] =>
      json.map(
        (localNews: JsonLocalNewsType) =>
          new LocalNewsModel({
            id: localNews.id,
            timestamp: DateTime.fromISO(localNews.display_date),
            title: localNews.title,
            content: localNews.message,
            availableLanguages: mapNewsAvailableLanguages(localNews.available_languages),
          }),
      ),
    )
    .build()
