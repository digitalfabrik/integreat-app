import { DateTime } from 'luxon'

import { TU_NEWS_TYPE } from '../../routes/index.js'
import Endpoint from '../Endpoint.js'
import EndpointBuilder from '../EndpointBuilder.js'
import NotFoundError from '../errors/NotFoundError.js'
import TuNewsModel from '../models/TuNewsModel.js'
import { JsonTuNewsType } from '../types.js'

export const TU_NEWS_ELEMENT_ENDPOINT_NAME = 'tuNewsElement'

type ParamsType = {
  id: number
}

export default (baseUrl: string): Endpoint<ParamsType, TuNewsModel> =>
  new EndpointBuilder<ParamsType, TuNewsModel>(TU_NEWS_ELEMENT_ENDPOINT_NAME)
    .withParamsToUrlMapper((params: ParamsType): string => `${baseUrl}/v1/news/${params.id}`)
    .withMapper((json: JsonTuNewsType | void[], params: ParamsType): TuNewsModel => {
      // The api is not good and returns an empty array if the tuNews does not exist
      if (Array.isArray(json)) {
        throw new NotFoundError({
          type: TU_NEWS_TYPE,
          id: params.id.toString(),
          language: 'unknown',
          region: 'unknown',
        })
      }

      return new TuNewsModel({
        id: json.id,
        title: json.title,
        tags: json.tags,
        lastUpdate: DateTime.fromISO(json.display_date),
        content: json.content,
        eNewsNo: json.enewsno,
      })
    })
    .build()
