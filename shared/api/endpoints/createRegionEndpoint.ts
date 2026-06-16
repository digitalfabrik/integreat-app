import Endpoint from '../Endpoint.js'
import EndpointBuilder from '../EndpointBuilder.js'
import { API_VERSION } from '../constants/index.js'
import mapRegionJson from '../mapping/mapRegionJson.js'
import RegionModel from '../models/RegionModel.js'

export const REGION_ENDPOINT_NAME = 'region'
type Params = {
  region: string
}

export default (baseUrl: string): Endpoint<Params, RegionModel> =>
  new EndpointBuilder<Params, RegionModel>(REGION_ENDPOINT_NAME)
    .withParamsToUrlMapper(({ region }: Params) => `${baseUrl}/api/${API_VERSION}/regions/${region}/`)
    .withMapper(mapRegionJson)
    .build()
