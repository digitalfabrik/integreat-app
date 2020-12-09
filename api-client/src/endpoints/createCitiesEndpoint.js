// @flow

import CityModel from '../models/CityModel'
import EndpointBuilder from '../EndpointBuilder'
import Endpoint from '../Endpoint'
import type { JsonCityType } from '../types'

const stripSlashes = (path: string): string => {
  if (path.startsWith('/')) {
    path = path.substr(1)
  }
  if (path.endsWith('/')) {
    path = path.substr(0, path.length - 1)
  }
  return path
}

export const CITIES_ENDPOINT_NAME = 'cities'

export default (baseUrl: string): Endpoint<void, Array<CityModel>> => new EndpointBuilder(CITIES_ENDPOINT_NAME)
  .withParamsToUrlMapper(() => `${baseUrl}/wp-json/extensions/v3/sites`)
  .withMapper((json: Array<JsonCityType>) => json.map(city => new CityModel({
    name: city.name,
    code: stripSlashes(city.path),
    live: city.live,
    eventsEnabled: city.events,
    offersEnabled: city.extras,
    poisEnabled: city.pois,
    tunewsEnabled: city.tunews,
    pushNotificationsEnabled: city.push_notifications,
    sortingName: city.name_without_prefix,
    prefix: city.prefix,
    longitude: city.longitude,
    latitude: city.latitude,
    aliases: city.aliases
  })).sort((city1, city2) => city1.sortingName.localeCompare(city2.sortingName)))
  .build()
