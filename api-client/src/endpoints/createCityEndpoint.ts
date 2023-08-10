import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import mapCityJson from '../mapping/mapCityJson'
import CityModel from '../models/CityModel'

export const CITY_ENDPOINT_NAME = 'city'
type Params = {
  city: string
}

export default (baseUrl: string): Endpoint<Params, CityModel> =>
  new EndpointBuilder<Params, CityModel>(CITY_ENDPOINT_NAME)
    .withParamsToUrlMapper(({ city }: Params) => `${baseUrl}/wp-json/extensions/v3/sites/${city}/`)
    .withMapper(mapCityJson)
    .build()
