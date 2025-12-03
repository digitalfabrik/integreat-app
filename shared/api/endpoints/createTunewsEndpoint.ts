import { DateTime } from 'luxon'

import parseHTML from '../../utils/parseHTML'
import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import TunewsModel from '../models/TunewsModel'
import { JsonTunewsType } from '../types'

export const TUNEWS_ENDPOINT_NAME = 'tunews'
type ParamsType = {
  language: string
  page: number
  count: number
}
export default (baseUrl: string): Endpoint<ParamsType, TunewsModel[]> =>
  new EndpointBuilder<ParamsType, TunewsModel[]>(TUNEWS_ENDPOINT_NAME)
    .withParamsToUrlMapper(
      (params: ParamsType): string => `${baseUrl}/v1/news/${params.language}?page=${params.page}&count=${params.count}`,
    )
    .withMapper((json: JsonTunewsType[]): TunewsModel[] =>
      json.map(
        (tunews: JsonTunewsType) =>
          new TunewsModel({
            id: tunews.id,
            title: tunews.title,
            tags: tunews.tags,
            date: DateTime.fromISO(tunews.display_date),
            content: parseHTML(tunews.content),
            eNewsNo: tunews.enewsno,
          }),
      ),
    )
    .build()
