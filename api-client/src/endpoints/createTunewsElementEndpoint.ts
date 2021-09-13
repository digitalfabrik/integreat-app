import moment from 'moment-timezone'

import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import NotFoundError from '../errors/NotFoundError'
import TunewsModel from '../models/TunewsModel'
import { TU_NEWS_TYPE } from '../routes'
import { JsonTunewsType } from '../types'
import { parseHTMLEntities } from '../utils/helpers'

export const TUNEWS_ELEMENT_ENDPOINT_NAME = 'tunewsElement'

type ParamsType = {
  id: number
}

export default (baseUrl: string): Endpoint<ParamsType, TunewsModel> =>
  new EndpointBuilder<ParamsType, TunewsModel>(TUNEWS_ELEMENT_ENDPOINT_NAME)
    .withParamsToUrlMapper((params: ParamsType): string => `${baseUrl}/v1/news/${params.id}`)
    .withMapper(
      (json: JsonTunewsType | Array<void>, params: ParamsType): TunewsModel => {
        // The api is not good and returns an empty array if the tunews does not exist
        if (Array.isArray(json)) {
          throw new NotFoundError({
            type: TU_NEWS_TYPE,
            id: params.id.toString(),
            language: 'unknown',
            city: 'unknown'
          })
        }

        const decodedTitle = parseHTMLEntities(json.title)

        return new TunewsModel({
          id: json.id,
          title: decodedTitle,
          tags: json.tags,
          date: moment.tz(json.date, 'GMT'),
          content: json.content,
          eNewsNo: json.enewsno
        })
      }
    )
    .build()
