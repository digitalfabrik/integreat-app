// @flow

import { apiUrl } from '../constants'
import EndpointBuilder from '../EndpointBuilder'
import type { JsonPageType } from '../types'
import mapPages from './mapPages'

const POIS_ENDPOINT_NAME = 'pois'

type ParamsType = { city: string, language: string }

export default new EndpointBuilder(POIS_ENDPOINT_NAME)
  .withParamsToUrlMapper((params: ParamsType): string =>
    `${apiUrl}/${params.city}/${params.language}/wp-json/extensions/v3/locations`)
  .withMapper((json: Array<JsonPageType>) => mapPages(json))
  .build()
