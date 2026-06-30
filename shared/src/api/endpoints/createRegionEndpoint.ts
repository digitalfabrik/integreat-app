import Endpoint from '../Endpoint.ts'
import EndpointBuilder from '../EndpointBuilder.ts'
import { API_VERSION } from '../constants/index.ts'
import mapRegionJson from '../mapping/mapRegionJson.ts'
import RegionModel from '../models/RegionModel.ts'

export const REGION_ENDPOINT_NAME = 'region'
type Params = {
  region: string
}

export default (baseUrl: string): Endpoint<Params, RegionModel> =>
  new EndpointBuilder<Params, RegionModel>(REGION_ENDPOINT_NAME)
    .withParamsToUrlMapper(({ region }: Params) => `${baseUrl}/api/${API_VERSION}/regions/${region}/`)
    .withMapper(mapRegionJson)
    .build()
