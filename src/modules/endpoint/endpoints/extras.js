// @flow

import { apiUrl } from '../constants'
import ExtraModel from '../models/ExtraModel'
import EndpointBuilder from '../EndpointBuilder'

import ParamMissingError from '../errors/ParamMissingError'
import type { EndpointParams } from '../../../flowTypes'

const EXTRAS_ENDPOINT_NAME = 'extras'

export default new EndpointBuilder(EXTRAS_ENDPOINT_NAME)
  .withParamsToUrlMapper((params: EndpointParams): string => {
    if (!params.city) {
      throw new ParamMissingError(EXTRAS_ENDPOINT_NAME, 'city')
    }
    if (!params.language) {
      throw new ParamMissingError(EXTRAS_ENDPOINT_NAME, 'language')
    }
    return `${apiUrl}/${params.city}/${params.language}/wp-json/extensions/v3/extras`
  })
  .withMapper((json: any): Array<ExtraModel> => json
    .map(extra => new ExtraModel({
      alias: extra.alias,
      name: extra.name,
      path: extra.url,
      thumbnail: extra.thumbnail
    })))
  .build()
