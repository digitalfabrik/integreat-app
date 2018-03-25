// @flow

import { apiUrl } from '../constants'
import ExtraModel from '../models/ExtraModel'
import EndpointBuilder from '../EndpointBuilder'
import type { Params } from '../Endpoint'

export default new EndpointBuilder('extras')
  .withParamsToUrlMapper((params: Params): string => `${apiUrl}/${params.city}/${params.language}/wp-json/extensions/v3/extras`)
  .withMapper((json: any): Array<ExtraModel> => json
    .map(extra => new ExtraModel({
      alias: extra.alias,
      name: extra.name,
      path: extra.url,
      thumbnail: extra.thumbnail
    })))
  .build()
