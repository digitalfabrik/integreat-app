import EndpointBuilder from '../EndpointBuilder'
import { JsonTunewsType } from '../types'
import TunewsModel from '../models/TunewsModel'
import moment from 'moment-timezone'
import Endpoint from '../Endpoint'
import NotFoundError from '../errors/NotFoundError'
import { TU_NEWS_TYPE } from '../routes'

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

        return new TunewsModel({
          id: json.id,
          title: json.title,
          tags: json.tags,
          date: moment.tz(json.date, 'GMT'),
          content: json.content,
          eNewsNo: json.enewsno
        })
      }
    )
    .build()
