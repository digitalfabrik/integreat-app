import { DateTime } from 'luxon'

import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import { API_VERSION } from '../constants'
import NotFoundError from '../errors/NotFoundError'
import PageModel from '../models/PageModel'
import { JsonImprintType } from '../types'

export const IMPRINT_ENDPOINT_NAME = 'imprint'
type ParamsType = {
  city: string
  language: string
}
export default (baseUrl: string): Endpoint<ParamsType, PageModel> =>
  new EndpointBuilder<ParamsType, PageModel>(IMPRINT_ENDPOINT_NAME)
    .withParamsToUrlMapper(
      (params: ParamsType): string => `${baseUrl}/api/${API_VERSION}/${params.city}/${params.language}/imprint/`,
    )
    .withMapper((json: JsonImprintType | null | undefined, params: ParamsType): PageModel => {
      if (!json) {
        throw new NotFoundError({ ...params, type: 'imprint', id: '' })
      }

      return new PageModel({
        path: json.path,
        title: json.title,
        content: json.content,
        lastUpdate: DateTime.fromISO(json.last_updated),
      })
    })
    .build()
