import { DateTime } from 'luxon'

import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import NotFoundError from '../errors/NotFoundError'
import TunewsModel from '../models/TunewsModel'
import { TU_NEWS_TYPE } from '../routes'
import { JsonTunewsType } from '../types'

export const TUNEWS_ELEMENT_ENDPOINT_NAME = 'tunewsElement'

type ParamsType = {
  id: number
}

export default (baseUrl: string): Endpoint<ParamsType, TunewsModel> =>
  new EndpointBuilder<ParamsType, TunewsModel>(TUNEWS_ELEMENT_ENDPOINT_NAME)
    .withParamsToUrlMapper((params: ParamsType): string => `${baseUrl}/v1/news/${params.id}`)
    .withMapper((json: JsonTunewsType | Array<void>, params: ParamsType): TunewsModel => {
      // The api is not good and returns an empty array if the tunews does not exist
      if (Array.isArray(json)) {
        throw new NotFoundError({
          type: TU_NEWS_TYPE,
          id: params.id.toString(),
          language: 'unknown',
          city: 'unknown',
        })
      }

      return new TunewsModel({
        id: json.id,
        title: json.title,
        tags: json.tags,
        date: DateTime.fromJSDate(new Date(json.date)).setZone('GMT'),
        content: json.content,
        eNewsNo: json.enewsno,
      })
    })
    .build()
