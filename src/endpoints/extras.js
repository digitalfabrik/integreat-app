// @flow

import ExtraModel from '../models/ExtraModel'
import EndpointBuilder from '../EndpointBuilder'

import ParamMissingError from '../errors/ParamMissingError'
import type { JsonExtraPostType, JsonExtraType } from '../types'
import Endpoint from '../Endpoint'

const EXTRAS_ENDPOINT_NAME = 'extras'

const createPostMap = (jsonPost: JsonExtraPostType): Map<string, string> => {
  const map = new Map()
  Object.keys(jsonPost).forEach(key => map.set(key, jsonPost[key]))
  return map
}

type ParamsType = { city: ?string, language: ?string }

const endpoint: Endpoint<ParamsType, Array<ExtraModel>> = new EndpointBuilder(EXTRAS_ENDPOINT_NAME)
  .withParamsToUrlMapper((apiUrl: string, params): string => {
    if (!params.city) {
      throw new ParamMissingError(EXTRAS_ENDPOINT_NAME, 'city')
    }
    if (!params.language) {
      throw new ParamMissingError(EXTRAS_ENDPOINT_NAME, 'language')
    }
    return `${apiUrl}/${params.city}/${params.language}/wp-json/extensions/v3/extras`
  })
  .withMapper((json: Array<JsonExtraType>) => json
    .map(extra => new ExtraModel({
      alias: extra.alias,
      title: extra.name,
      path: extra.url,
      thumbnail: extra.thumbnail,
      postData: extra.post ? createPostMap(extra.post) : null
    })))
  .build()

export default endpoint
