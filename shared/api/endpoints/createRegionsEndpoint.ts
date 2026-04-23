import { Endpoint, EndpointBuilder, CityModel } from '..'

import { API_VERSION } from '../constants'
import mapRegionJson from '../mapping/mapRegionJson'
import { JsonCityType } from '../types'

export const CITIES_ENDPOINT_NAME = 'cities'

export default (baseUrl: string): Endpoint<Record<string, unknown> | void, CityModel[]> =>
  new EndpointBuilder<Record<string, unknown> | void, CityModel[]>(CITIES_ENDPOINT_NAME)
    .withParamsToUrlMapper(() => `${baseUrl}/api/${API_VERSION}/regions/`)
    .withMapper((json: JsonCityType[]) =>
      json.map(mapRegionJson).sort((city1, city2) => city1.sortingName.localeCompare(city2.sortingName)),
    )
    .build()
