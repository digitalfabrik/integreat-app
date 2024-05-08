import { Endpoint, EndpointBuilder, CityModel } from '..'

import mapCityJson from '../mapping/mapCityJson'

export const CITY_ENDPOINT_NAME = 'city'
type Params = {
  city: string
}

export default (baseUrl: string): Endpoint<Params, CityModel> =>
  new EndpointBuilder<Params, CityModel>(CITY_ENDPOINT_NAME)
    .withParamsToUrlMapper(({ city }: Params) => `${baseUrl}/api/v3/regions/${city}/`)
    .withMapper(mapCityJson)
    .build()
