// @flow

import { apiUrl } from '../constants'
import EndpointBuilder from '../EndpointBuilder'
import PointOfInterestModel from '../models/PointOfInterestModel'
import type { JsonPointOfInterestType } from './jsonTypes/JsonPointOfInterestType'
import moment from 'moment'

const POINTS_OF_INTEREST_ENDPOINT_NAME = 'pointsOfInterest'

type ParamsType = { city: string, language: string }

export default new EndpointBuilder(POINTS_OF_INTEREST_ENDPOINT_NAME)
  .withParamsToUrlMapper((params: ParamsType): string =>
    `${apiUrl}/${params.city}/${params.language}/wp-json/extensions/v3/locations`)
  .withMapper((json: Array<JsonPointOfInterestType>) =>
    json.map(pointOfInterest => {
      const availableLanguages = new Map()
      Object.keys(pointOfInterest.available_languages)
        .forEach(language => availableLanguages.set(language, pointOfInterest.available_languages[language].id))
      return new PointOfInterestModel({
        id: pointOfInterest.id,
        path: pointOfInterest.path,
        title: pointOfInterest.title,
        content: pointOfInterest.content,
        thumbnail: pointOfInterest.thumbnail,
        availableLanguages: availableLanguages,
        excerpt: pointOfInterest.excerpt,
        address: pointOfInterest.location.address,
        town: pointOfInterest.location.town,
        postcode: pointOfInterest.location.postcode,
        longitude: pointOfInterest.location.longitude,
        latitude: pointOfInterest.location.latitude,
        lastUpdate: moment(pointOfInterest.modified_gmt)
      })
    }))
  .build()
