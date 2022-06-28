import moment from 'moment-timezone'

import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import mapAvailableLanguages from '../mapAvailableLanguages'
import LocationModel from '../models/LocationModel'
import PoiModel from '../models/PoiModel'
import { JsonPoiType } from '../types'

export const POIS_ENDPOINT_NAME = 'pois'
type ParamsType = {
  city: string
  language: string
}
export default (baseUrl: string): Endpoint<ParamsType, Array<PoiModel>> =>
  new EndpointBuilder<ParamsType, Array<PoiModel>>(POIS_ENDPOINT_NAME)
    .withParamsToUrlMapper(
      (params: ParamsType): string => `${baseUrl}/${params.city}/${params.language}/wp-json/extensions/v3/locations`
    )
    .withMapper(
      (json: Array<JsonPoiType>): Array<PoiModel> =>
        json
          .filter(poi => poi.location.id && poi.location.name && poi.location.latitude && poi.location.longitude)
          .map(
            poi =>
              new PoiModel({
                path: poi.path,
                title: poi.title,
                content: poi.content,
                thumbnail: poi.thumbnail,
                availableLanguages: mapAvailableLanguages(poi.available_languages),
                excerpt: poi.excerpt,
                website: poi.website,
                phoneNumber: poi.phone_number,
                email: poi.email,
                location: new LocationModel({
                  id: poi.location.id,
                  name: poi.location.name,
                  address: poi.location.address,
                  town: poi.location.town,
                  state: poi.location.state,
                  postcode: poi.location.postcode,
                  region: poi.location.region,
                  country: poi.location.country,
                  latitude: poi.location.latitude,
                  longitude: poi.location.longitude
                }),
                lastUpdate: moment.tz(poi.modified_gmt, 'GMT'),
                hash: poi.hash
              })
          )
    )
    .build()
