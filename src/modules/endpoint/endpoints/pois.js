// @flow

import { apiUrl } from '../constants'
import EndpointBuilder from '../EndpointBuilder'
import type { JsonPoiType } from '../types'
import PoiModel from '../models/PoiModel'
import normalizePath from '../normalizePath'
import mapAvailableLanguages from '../mapAvailableLanguages'
import moment from 'moment'
import LocationModel from '../models/LocationModel'

const POIS_ENDPOINT_NAME = 'pois'

type ParamsType = { city: string, language: string }

export default new EndpointBuilder(POIS_ENDPOINT_NAME)
  .withParamsToUrlMapper((params: ParamsType): string =>
    `${apiUrl}/${params.city}/${params.language}/wp-json/extensions/v3/locations`)
  .withMapper((json: Array<JsonPoiType>) =>
    json.map(poi => {
      return new PoiModel({
        id: poi.id,
        path: normalizePath(poi.path),
        title: poi.title,
        content: poi.content,
        thumbnail: poi.thumbnail,
        availableLanguages: mapAvailableLanguages(poi.available_languages),
        excerpt: poi.excerpt,
        location: new LocationModel({
          address: poi.location.address,
          town: poi.location.town,
          postcode: poi.location.postcode,
          longitude: poi.location.longitude,
          latitude: poi.location.latitude
        }),
        lastUpdate: moment(poi.modified_gmt)
      })
    }))
  .build()
