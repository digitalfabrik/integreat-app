// @flow

import { apiUrl } from '../constants'
import EndpointBuilder from '../EndpointBuilder'
import PoiModel from '../models/PoiModel'
import moment from 'moment'
import type { JsonPoiType } from '../types'

const POI__ENDPOINT_NAME = 'pois'

type ParamsType = { city: string, language: string }

export default new EndpointBuilder(POI__ENDPOINT_NAME)
  .withParamsToUrlMapper((params: ParamsType): string =>
    `${apiUrl}/${params.city}/${params.language}/wp-json/extensions/v3/locations`)
  .withMapper((json: Array<JsonPoiType>) =>
    json.map(poi => {
      const availableLanguages = new Map()
      Object.keys(poi.available_languages)
        .forEach(language => availableLanguages.set(language, poi.available_languages[language].id))
      const id = poi.path.split('/')[4]
      return new PoiModel({
        id: id,
        title: poi.title,
        content: poi.content,
        thumbnail: poi.thumbnail,
        availableLanguages: availableLanguages,
        excerpt: poi.excerpt,
        address: poi.location.address,
        town: poi.location.town,
        postcode: poi.location.postcode,
        longitude: poi.location.longitude,
        latitude: poi.location.latitude,
        lastUpdate: moment(poi.modified_gmt)
      })
    }))
  .build()
