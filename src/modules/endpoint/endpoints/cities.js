// @flow

import CityModel from '../models/CityModel'
import { apiUrl } from '../constants'
import EndpointBuilder from '../EndpointBuilder'
import type { PayloadDataType } from '../../../flowTypes'

const stripSlashes = (path: string): string => {
  if (path.startsWith('/')) {
    path = path.substr(1)
  }
  if (path.endsWith('/')) {
    path = path.substr(0, path.length - 1)
  }
  return path
}

export default new EndpointBuilder('cities')
  .withParamsToUrlMapper((): string => `${apiUrl}/wp-json/extensions/v3/sites`)
  .withMapper((json: any): PayloadDataType => json
    .map(city => new CityModel({
      name: city.name,
      code: stripSlashes(city.path),
      live: city.live,
      eventsEnabled: city.events,
      extrasEnabled: city.extras,
      sortingName: city.name_without_prefix
    }))
    .sort((city1, city2) => city1.sortingName.localeCompare(city2.sortingName))
  )
  .build()
