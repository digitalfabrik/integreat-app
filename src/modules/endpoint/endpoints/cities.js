// @flow

import { sortBy } from 'lodash/collection'

import CityModel from '../models/CityModel'
import { apiUrl } from '../constants'
import EndpointBuilder from '../EndpointBuilder'

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
  .withMapper((json: any): Array<CityModel> => {
    console.log(json)
    const cities = json
      .map(_city => new CityModel({
        name: _city.name,
        code: stripSlashes(_city.path),
        live: _city.live,
        eventsEnabled: _city.events,
        extrasEnabled: _city.extras
      }))
      .sort(_city => _city.name)
    return sortBy(cities, _city => _city.sortKey)
  })
  .build()
