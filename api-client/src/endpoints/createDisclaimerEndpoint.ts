import { DateTime } from 'luxon'

import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import NotFoundError from '../errors/NotFoundError'
import PageModel from '../models/PageModel'
import { JsonDisclaimerType } from '../types'

export const DISCLAIMER_ENDPOINT_NAME = 'disclaimer'
type ParamsType = {
  city: string
  language: string
}
export default (baseUrl: string): Endpoint<ParamsType, PageModel> =>
  new EndpointBuilder<ParamsType, PageModel>(DISCLAIMER_ENDPOINT_NAME)
    .withParamsToUrlMapper(
      (params: ParamsType): string => `${baseUrl}/${params.city}/${params.language}/wp-json/extensions/v3/disclaimer/`
    )
    .withMapper((json: JsonDisclaimerType | null | undefined, params: ParamsType): PageModel => {
      if (!json) {
        throw new NotFoundError({ ...params, type: 'disclaimer', id: '' })
      }

      return new PageModel({
        path: json.path,
        title: json.title,
        content: json.content,
        lastUpdate: DateTime.fromJSDate(new Date(json.modified_gmt), { zone: 'GMT' }),
      })
    })
    .build()
