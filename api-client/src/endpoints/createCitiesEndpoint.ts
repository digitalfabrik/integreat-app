import { BBox } from 'geojson'

import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import CityModel from '../models/CityModel'
import { JsonCityType } from '../types'

const stripSlashes = (path: string): string => {
  let code = path
  if (code.startsWith('/')) {
    code = code.substr(1)
  }

  if (code.endsWith('/')) {
    code = code.substr(0, code.length - 1)
  }

  return code
}

export const CITIES_ENDPOINT_NAME = 'cities'
export default (baseUrl: string): Endpoint<void, Array<CityModel>> =>
  new EndpointBuilder<void, Array<CityModel>>(CITIES_ENDPOINT_NAME)
    .withParamsToUrlMapper(() => `${baseUrl}/wp-json/extensions/v3/sites`)
    .withMapper((json: Array<JsonCityType>) =>
      json
        .map(
          city =>
            new CityModel({
              name: city.name,
              code: stripSlashes(city.path),
              live: city.live,
              eventsEnabled: city.events,
              offersEnabled: city.extras,
              poisEnabled: city.pois,
              tunewsEnabled: city.tunews,
              localNewsEnabled: city.push_notifications,
              sortingName: city.name_without_prefix,
              prefix: city.prefix,
              longitude: city.longitude,
              latitude: city.latitude,
              aliases: city.aliases,
              boundingBox: Array.isArray(city.bounding_box)
                ? ([...city.bounding_box[0]!, ...city.bounding_box[1]!] as BBox)
                : null,
            })
        )
        .sort((city1, city2) => city1.sortingName.localeCompare(city2.sortingName))
    )
    .build()
