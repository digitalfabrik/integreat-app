import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import mapCityJson from '../mapping/mapCityJson'
import CityModel from '../models/CityModel'
import { JsonCityType } from '../types'

export const CITIES_ENDPOINT_NAME = 'cities'

export default (baseUrl: string): Endpoint<void, CityModel[]> =>
  new EndpointBuilder<void, CityModel[]>(CITIES_ENDPOINT_NAME)
    .withParamsToUrlMapper(() => `${baseUrl}/wp-json/extensions/v3/sites/`)
    .withMapper((json: JsonCityType[]) =>
      json.map(mapCityJson).sort((city1, city2) => city1.sortingName.localeCompare(city2.sortingName))
    )
    .build()
