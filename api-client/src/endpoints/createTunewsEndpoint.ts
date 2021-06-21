import EndpointBuilder from '../EndpointBuilder'
import { JsonTunewsType } from '../types'
import TunewsModel from '../models/TunewsModel'
import moment from 'moment-timezone'
import Endpoint from '../Endpoint'
import { sanitize } from 'isomorphic-dompurify'

export const TUNEWS_ENDPOINT_NAME = 'tunews'
type ParamsType = {
  city: string
  language: string
  page: number
  count: number
}
export default (baseUrl: string): Endpoint<ParamsType, Array<TunewsModel>> =>
  new EndpointBuilder<ParamsType, Array<TunewsModel>>(TUNEWS_ENDPOINT_NAME)
    .withParamsToUrlMapper(
      (params: ParamsType): string => `${baseUrl}/v1/news/${params.language}?page=${params.page}&count=${params.count}`
    )
    .withMapper(
      (json: Array<JsonTunewsType>): Array<TunewsModel> =>
        json.map((tunews: JsonTunewsType) => {
          return new TunewsModel({
            id: tunews.id,
            title: tunews.title,
            tags: tunews.tags,
            date: moment.tz(tunews.date, 'GMT'),
            content: sanitize(tunews.content),
            eNewsNo: tunews.enewsno
          })
        })
    )
    .build()
