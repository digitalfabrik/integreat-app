// @flow

import { apiUrl } from '../constants'
import EndpointBuilder from '../EndpointBuilder'
import ParamMissingError from '../errors/ParamMissingError'
import type { JsonPageType } from '../types'
import mapPages from './mapPages'

const EVENTS_ENDPOINT_NAME = 'events'

type ParamsType = {
  city: ?string,
  language: ?string
}

export default new EndpointBuilder(EVENTS_ENDPOINT_NAME)
  .withParamsToUrlMapper((params: ParamsType): string => {
    if (!params.city) {
      throw new ParamMissingError(EVENTS_ENDPOINT_NAME, 'city')
    }
    if (!params.language) {
      throw new ParamMissingError(EVENTS_ENDPOINT_NAME, 'language')
    }
    return `${apiUrl}/${params.city}/${params.language}/wp-json/extensions/v3/events`
  })
  .withMapper((json: Array<JsonPageType>) => mapPages(json))
  .build()
